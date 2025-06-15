import re
from typing import Any, Dict, List, Tuple, Union
from xml.etree import ElementTree
from xml.etree.ElementTree import ParseError

from loguru import logger


def convert_xml_to_dict_manually_util(
    current_tag: str,
    all_tags: List[str],
    xml_content: str,
    current_index: int,
) -> Tuple[Union[Dict[str, Any], str, None], int]:
    """
    Recursively converts XML content to a dictionary or string.
    
    This utility function is used by convert_xml_to_dict_manually to process XML tags
    and their content recursively. It handles both nested tags (returning dictionaries)
    and leaf tags (returning strings).

    Args:
        current_tag: Current XML tag being processed
        all_tags: List of all XML tags extracted from the content
        xml_content: Full XML content string
        current_index: Index of the current tag in the list of tags

    Returns:
        Tuple containing:
        - Dictionary of nested XML content, string of tag content, or None if processing incomplete
        - Index of next tag to process
        
    Raises:
        ValueError: If matching opening/closing tags cannot be found
    """
    # Dictionary to store nested tag content
    result_dict = {}

    index = current_index
    while index < len(all_tags):
        tag = all_tags[index]

        # Handle closing tags (e.g. </tag>)
        if tag.startswith("/"):
            tag = tag.replace("/", "")

            # If closing tag matches current tag, return accumulated content
            if current_tag == tag:
                if len(result_dict) > 0:
                    # Return dictionary for nested content
                    return result_dict, index + 1
                # Extract raw content between opening and closing tags
                start_pos = xml_content.find(f"<{current_tag}>") + len(f"<{current_tag}>")
                end_pos = xml_content.find(f"</{current_tag}>")
                if start_pos == -1 or end_pos == -1:
                    raise ValueError(f"Could not find matching tags for {current_tag}")
                return xml_content[start_pos:end_pos].strip(), index + 1

            # If closing tag doesn't match, return to parent
            return None, index

        # Handle opening tags (e.g. <tag>)

        # Recursively process nested tag content
        nested_content, next_index = convert_xml_to_dict_manually_util(
            tag,
            all_tags,
            xml_content,
            index + 1,
        )

        # Add nested content to result if not None
        if nested_content is not None:
            result_dict[tag] = nested_content

        index = next_index

    # If we've processed all tags and haven't returned a result, return None
    return None, index


def convert_xml_to_dict_manually(xml_content: str) -> Dict[str, Any]:
    """
    Convert XML content to a dictionary manually using a custom parser.
    
    This function is used as a fallback when the standard ElementTree parser fails.
    It extracts XML tags using regex and processes them recursively to build a
    dictionary representation of the XML content.

    Args:
        xml_content: XML content string to convert

    Returns:
        Dictionary representation of the XML content

    Raises:
        TypeError: If content is not a string
        ValueError: If content is empty or invalid XML
        Exception: If conversion fails for any other reason
    """
    # Validate input
    if not isinstance(xml_content, str):
        logger.error("XML content must be a string")
        raise TypeError("Content must be a string")
        
    xml_content = xml_content.strip()
    if not xml_content:
        logger.error("XML content cannot be empty")
        raise ValueError("Content cannot be empty")

    try:
        # Extract all XML tags using regex
        tags = re.findall(r"<(.*?)>", xml_content)
        if not tags:
            logger.warning("No XML tags found in content")
            raise ValueError("No XML tags found in content")
            
        logger.debug(f"Found {len(tags)} XML tags")

        # Process all tags sequentially
        index = 0
        result_dict = {}
        while index < len(tags):
            # Skip closing tags at the top level
            if tags[index].startswith("/"):
                index += 1
                continue
                
            # Convert each top-level tag and its content
            tag_content, next_index = convert_xml_to_dict_manually_util(
                tags[index],
                tags,
                xml_content,
                index + 1,
            )

            # Add tag content to result if not None
            if tag_content is not None:
                result_dict[tags[index]] = tag_content

            index = next_index

        if not result_dict:
            logger.warning("Failed to extract any content from XML")
            raise ValueError("Failed to extract any content from XML")
            
        return result_dict
        
    except Exception as e:
        logger.error(f"Error in manual XML conversion: {str(e)}")
        raise


def convert_xml_to_dict(xml_content: str) -> Dict[str, Any]:
    """
    Convert XML content to a dictionary using ElementTree with fallback to manual conversion.
    
    This function attempts to parse XML content using the standard ElementTree parser.
    If that fails, it falls back to a custom manual parser that can handle some malformed XML.

    Args:
        xml_content: The XML content to convert to a dictionary

    Returns:
        Dictionary representation of the XML content
        
    Raises:
        TypeError: If content is not a string
        ValueError: If content is empty or completely invalid XML
        Exception: For other parsing errors that can't be handled by the fallback parser
    """
    # Validate input
    if not isinstance(xml_content, str):
        logger.error("XML content must be a string")
        raise TypeError("Content must be a string")
        
    xml_content = xml_content.strip()
    if not xml_content:
        logger.error("XML content cannot be empty")
        raise ValueError("Content cannot be empty")

    # Add a root element to the XML content to ensure it's well-formed
    wrapped_xml_content = f"<root>{xml_content}</root>"

    # Convert the XML content to a dictionary recursively
    def xml_to_dict_recursive(root) -> Union[Dict[str, Any], str]:
        """Recursively convert an XML element to a dictionary."""
        # If node has no children, return its text content
        if len(list(root)) == 0:
            return root.text.strip() if root.text else ""

        # Dictionary to store child nodes
        result = {}

        # Process each child node
        for child in list(root):
            child_value = xml_to_dict_recursive(child)
            
            # Handle duplicate tags by converting to lists
            if child.tag in result:
                # If value is already a list, append to it
                if isinstance(result[child.tag], list):
                    result[child.tag].append(child_value)
                # If not a list, convert to list with both values
                else:
                    result[child.tag] = [result[child.tag], child_value]
            # First time seeing this tag
            else:
                result[child.tag] = child_value

        return result

    try:
        # Try standard ElementTree parsing first
        logger.debug("Attempting to parse XML with ElementTree")
        root = ElementTree.XML(wrapped_xml_content)
        result = xml_to_dict_recursive(root)
        
        # The result will include the artificial root element, so return its contents
        return result

    except ParseError as e:
        # If standard parsing fails, try manual conversion
        logger.warning(f"ElementTree parsing failed: {e}. Trying manual conversion.")
        try:
            result = convert_xml_to_dict_manually(xml_content)
            logger.info("Manual XML conversion successful")
            return result
        except Exception as manual_error:
            logger.error(f"Manual XML conversion also failed: {manual_error}")
            raise ValueError(f"Failed to parse XML content: {str(e)}. Manual parsing also failed: {str(manual_error)}")
    
    except Exception as e:
        logger.error(f"Unexpected error converting XML to dictionary: {e}")
        raise
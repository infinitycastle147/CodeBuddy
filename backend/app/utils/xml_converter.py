import re
from typing import Any, Dict
from xml.etree import ElementTree

from loguru import logger


def convert_xml_to_dict_manually_util(
    current_tag: str,
    all_tags: list[str],
    xml_content: str,
    current_index: int,
) -> tuple[dict | str, int]:
    """
    Recursively converts XML content to a dictionary or string.

    Args:
        current_tag: Current XML tag being processed
        all_tags: List of remaining XML tags to process
        xml_content: Full XML content string
        current_index: Index of the current tag in the list of tags

    Returns:
        Tuple containing:
        - Dictionary of nested XML content or string of tag content
        - Index of next tag to process
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


def convert_xml_to_dict_manually(xml_content: str) -> dict:
    """
    Convert XML content to a dictionary manually.

    Args:
        xml_content: XML content string to convert

    Returns:
        Dictionary representation of the XML content

    Raises:
        TypeError: If content is not a string
        ValueError: If content is empty or invalid XML
        Exception: If conversion fails
    """
    # Validate input
    if not isinstance(xml_content, str):
        raise TypeError("Content must be a string")
    if not xml_content.strip():
        raise ValueError("Content cannot be empty")

    # Extract all XML tags using regex
    tags = re.findall(r"<(.*?)>", xml_content)
    if not tags:
        raise ValueError("No XML tags found in content")

    # Process all tags sequentially
    index = 0
    result_dict = {}
    while index < len(tags):
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

    return result_dict


def convert_xml_to_dict(xml_content: str) -> Dict[str, Any]:
    """
    Convert XML content to a dictionary.

    Arguments:
        xml_content: str -- The XML content to convert to a dictionary.

    Returns:
        Dict[str, Any] -- The dictionary representation of the XML content.
    """

    # Add a root element to the XML content
    wrapped_xml_content = f"<root>{xml_content.strip()}</root>"

    # Convert the XML content to a dictionary recursively
    def xml_to_dict_recursive(root):
        # If node has no children, return its text content
        if len(list(root)) == 0:
            return root.text.strip() if root.text else ""

        # Dictionary to store child nodes
        temp = {}

        # Process each child node
        for child in list(root):
            # If we've seen this tag before
            if child.tag in temp:
                # If value is already a list, append to it
                if isinstance(temp[child.tag], list):
                    temp[child.tag].append(xml_to_dict_recursive(child))
                # If not a list, convert to list with both values
                else:
                    temp[child.tag] = [temp[child.tag], xml_to_dict_recursive(child)]
            # First time seeing this tag
            else:
                temp[child.tag] = xml_to_dict_recursive(child)

        # Return dictionary with root tag as key
        return temp

    try:
        # Convert the XML content to a dictionary
        root = ElementTree.XML(wrapped_xml_content)

        # Return the dictionary representation of the XML content
        return xml_to_dict_recursive(root)

    except Exception as e:
        logger.error(f"Error converting XML to dictionary: {e}")

        # Find the first occurence of a tag in the xml content
        try:
            converted_content = convert_xml_to_dict_manually(xml_content)

            if isinstance(converted_content, dict):
                return converted_content
            raise e
        except Exception as e:
            logger.error(f"Error converting XML to dictionary: {e}")
            raise e

        raise e
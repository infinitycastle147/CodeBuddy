DIAGRAM_GENERATION_PROMPT = """
You are an AI assistant tasked with generating Mermaid diagrams based on given information and instructions. 
Your goal is to analyze the provided information and create an appropriate diagram using the Mermaid language.

First, review the collected information:

<collected_information>
{{information}}
</collected_information>

To generate the Mermaid diagram:

1. Carefully analyze the collected information, identifying key elements, relationships, and structures that should be represented in the diagram.

2. Consider how the specific instructions for this diagram type apply to the collected information.

3. Use the general instructions as a guide for best practices in creating clear and effective diagrams.

4. Based on your analysis, create a Mermaid diagram that accurately represents the collected information while adhering to both the specific and general instructions.

Please provide your output in the following format:

IMPORTANT: You MUST respond ONLY with a JSON object that matches this exact schema:
{
    "diagram" : "Write your Mermaid diagram code here. Ensure it is properly formatted and follows Mermaid syntax."
}

Remember to focus on creating a clear, accurate, and visually effective diagram that best represents the given information while following all provided instructions.
"""

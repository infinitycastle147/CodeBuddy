DIAGRAM_GENERATION_PROMPT = """
You are an AI assistant tasked with generating Mermaid diagrams based on given information and instructions. Your goal is to analyze the provided information and create an appropriate diagram using the Mermaid language.

First, review the collected information:

<collected_information>
{{COLLECTED_INFORMATION}}
</collected_information>

Now, consider the specific instructions for this diagram type:

<specific_instructions>
{{SPECIFIC_INSTRUCTIONS}}
</specific_instructions>

Keep in mind these general instructions for creating diagrams:

<general_instructions>
{{GENERAL_INSTRUCTIONS}}
</general_instructions>

To generate the Mermaid diagram:

1. Carefully analyze the collected information, identifying key elements, relationships, and structures that should be represented in the diagram.

2. Consider how the specific instructions for this diagram type apply to the collected information.

3. Use the general instructions as a guide for best practices in creating clear and effective diagrams.

4. Based on your analysis, create a Mermaid diagram that accurately represents the collected information while adhering to both the specific and general instructions.

5. Ensure that your diagram is well-structured, easy to read, and follows Mermaid syntax correctly.

6. If you encounter any ambiguities or need to make assumptions, briefly explain your reasoning.

Please provide your output in the following format:

<analysis>
Briefly explain your analysis of the collected information and how you applied the instructions to create the diagram.
</analysis>

<mermaid_diagram>
Write your Mermaid diagram code here. Ensure it is properly formatted and follows Mermaid syntax.
</mermaid_diagram>

<explanation>
If necessary, provide any additional explanations about your diagram, including any assumptions made or clarifications about your interpretation of the information and instructions.
</explanation>

Remember to focus on creating a clear, accurate, and visually effective diagram that best represents the given information while following all provided instructions."""

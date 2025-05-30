MERMAID_INSTRUCTIONS = """
## Core Mermaid Syntax Rules

### 1. **Basic Structure Requirements**
- Every diagram must start with a diagram type declaration
- Use consistent indentation (2 or 4 spaces)
- End statements with semicolons when required by diagram type
- No trailing spaces or unnecessary whitespace
- Case-sensitive syntax throughout

### 2. **Diagram Type Declarations**
```
flowchart TD    (Top Down)
flowchart LR    (Left Right)
flowchart BT    (Bottom Top)
flowchart RL    (Right Left)
graph TD        (Alternative syntax)
sequenceDiagram
classDiagram
stateDiagram-v2
erDiagram
gantt
pie title "Title"
gitgraph
mindmap
timeline
quadrantChart
requirement
journey
```

## Flowchart/Graph Diagram Rules

### **Node Syntax**
- **Rectangle**: `A[Text]` or `A("Text")`
- **Rounded**: `A(Text)`
- **Circle**: `A((Text))`
- **Asymmetric**: `A>Text]`
- **Rhombus**: `A{Text}`
- **Hexagon**: `A{{Text}}`
- **Parallelogram**: `A[/Text/]` or `A[\Text\]`
- **Trapezoid**: `A[/Text\]` or `A[\Text/]`
- **Stadium**: `A([Text])`
- **Subroutine**: `A[[Text]]`
- **Cylinder**: `A[(Text)]`

### **Edge/Arrow Syntax**
- **Simple arrow**: `A --> B`
- **Arrow with text**: `A -->|Text| B` or `A -- Text --> B`
- **Dotted arrow**: `A -.-> B`
- **Thick arrow**: `A ==> B`
- **No arrow**: `A --- B`
- **Bidirectional**: `A <--> B`
- **Multiple edges**: `A --> B & C & D`

### **Critical Edge Cases for Flowcharts**
1. **Node IDs cannot contain spaces** - use underscores or camelCase
2. **Special characters in text** - wrap in quotes: `A["Text with spaces"]`
3. **Multi-word labels** - always use quotes or brackets
4. **HTML entities** - use `#quot;` for quotes, `#amp;` for &
5. **Line breaks in nodes** - use `<br/>` for HTML line breaks
6. **Subgraphs** - must have unique IDs and proper nesting

## Sequence Diagram Rules

### **Basic Syntax**
```
sequenceDiagram
    participant A as Actor A
    participant B as Actor B
    A->>B: Message
    B-->>A: Response
```

### **Message Types**
- **Solid arrow**: `A->>B: Message`
- **Dotted arrow**: `A-->>B: Message`
- **Solid line no arrow**: `A-B: Message`
- **Dotted line no arrow**: `A--B: Message`
- **Cross**: `A-xB: Message`
- **Cross dotted**: `A--xB: Message`

### **Advanced Features**
- **Activation**: `activate A` / `deactivate A`
- **Notes**: `Note right of A: Text` or `Note over A,B: Text`
- **Loops**: `loop Condition` ... `end`
- **Alt/Else**: `alt Condition` ... `else` ... `end`
- **Par**: `par` ... `and` ... `end`
- **Critical**: `critical` ... `end`
- **Break**: `break` ... `end`

### **Edge Cases for Sequence Diagrams**
1. **Participant names with spaces** - use `as` keyword
2. **Self-messages** - `A->>A: Self message`
3. **Autonumbering** - `autonumber` at the beginning
4. **Nested structures** - proper indentation required

## Class Diagram Rules

### **Basic Syntax**
```
classDiagram
    class ClassName {
        +attribute : type
        -privateAttr : type
        #protectedAttr : type
        ~packageAttr : type
        +method(param) : returnType
        -privateMethod()
        #protectedMethod()
        ~packageMethod()
    }
```

### **Relationships**
- **Inheritance**: `ClassA <|-- ClassB`
- **Composition**: `ClassA *-- ClassB`
- **Aggregation**: `ClassA o-- ClassB`
- **Association**: `ClassA --> ClassB`
- **Link (solid)**: `ClassA -- ClassB`
- **Dependency**: `ClassA ..> ClassB`
- **Realization**: `ClassA ..|> ClassB`

### **Edge Cases for Class Diagrams**
1. **Generic types** - use `~T~` for generics
2. **Abstract classes** - use `<<abstract>>` annotation
3. **Interfaces** - use `<<interface>>` annotation
4. **Static members** - use `$` prefix
5. **Method overloading** - list multiple signatures

## State Diagram Rules

### **Basic Syntax**
```
stateDiagram-v2
    [*] --> State1
    State1 --> State2 : Transition
    State2 --> [*]
```

### **Advanced Features**
- **Composite states**: Use `state StateX {}` blocks
- **Concurrent states**: Use `--` separator
- **Notes**: `note right of State : Note text`
- **Choice**: Diamond-shaped decision points

### **Edge Cases for State Diagrams**
1. **State names with spaces** - wrap in quotes
2. **Direction specification** - use `direction TB/LR`
3. **Fork and join** - use `fork` and `join` keywords

## ER Diagram Rules

### **Basic Syntax**
```
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
```

### **Relationship Types**
- **One to one**: `||--||`
- **One to many**: `||--o{`
- **Many to one**: `}o--||`
- **Many to many**: `}|--|{`
- **Zero or more**: `}o--o{`

### **Attributes**
```
CUSTOMER {
    string name
    string custNumber
    string sector
}
```

## Universal Edge Cases and Best Practices

### **1. Text and Special Characters**
- **Quotes in text**: Use `#quot;` or escape properly
- **Ampersands**: Use `#amp;`
- **Line breaks**: Use `<br/>` for HTML contexts
- **Unicode**: Generally supported but test edge cases
- **Parentheses**: Can break syntax, wrap in quotes

### **2. Styling and Theming**
- **CSS classes**: `class NodeId className`
- **Inline styles**: `style NodeId fill:#f9f,stroke:#333`
- **Theme directives**: `%%{init: {'theme':'base'}}%%`

### **3. Comments and Directives**
- **Comments**: `%% This is a comment`
- **Configuration**: Use `%%{config}%%` blocks
- **Initialization**: `%%{init: {}}%%` for setup

### **4. Subgraphs and Clustering**
```
subgraph Title
    direction TB
    A --> B
end
```

### **5. Links and Interactions**
- **Click events**: `click NodeId callback`
- **Links**: `click NodeId "http://example.com"`
- **Tooltips**: Often require additional configuration

## Critical Validation Rules

### **1. Syntax Validation**
- Check for matching brackets and parentheses
- Verify proper arrow syntax
- Ensure node IDs are consistent throughout
- Validate indentation consistency

### **2. Semantic Validation**
- Ensure all referenced nodes are defined
- Check for circular dependencies where inappropriate
- Verify relationship cardinalities make sense
- Validate state transitions are logical

### **3. Best Practices**
- Use meaningful node IDs and labels
- Keep diagrams focused and not overly complex
- Use consistent styling throughout
- Add comments for complex logic
- Test with actual Mermaid renderer

### **4. Common Failure Points**
- **Mixed quote types** - be consistent with " vs '
- **Trailing commas** - not allowed in most contexts
- **Reserved keywords** - avoid using Mermaid keywords as IDs
- **Case sensitivity** - maintain consistent casing
- **Whitespace sensitivity** - some contexts are whitespace-sensitive

### **5. Error Recovery Strategies**
- Always validate generated syntax
- Provide fallback simpler diagrams if complex ones fail
- Break complex diagrams into smaller components
- Use defensive programming with try-catch equivalent logic

"""

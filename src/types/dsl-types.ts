// Token types for parsing
export enum TokenType {
    IDENTIFIER = 'IDENTIFIER',
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    EQUALS = 'EQUALS',
    COMMA = 'COMMA',
    LEFT_PAREN = 'LEFT_PAREN',
    RIGHT_PAREN = 'RIGHT_PAREN',
    LEFT_BRACE = 'LEFT_BRACE',
    RIGHT_BRACE = 'RIGHT_BRACE',
    COLON = 'COLON',
    SEMICOLON = 'SEMICOLON',
    COMMENT = 'COMMENT',
    WHITESPACE = 'WHITESPACE',
    EOL = 'EOL',
    EOF = 'EOF',
    KEYWORD = 'KEYWORD',
    // New token types
    ARROW = 'ARROW',
    DOT = 'DOT',
    NODE_KEYWORD = 'NODE_KEYWORD',
    WORKSPACE_KEYWORD = 'WORKSPACE_KEYWORD',
    CONNECTIONS_KEYWORD = 'CONNECTIONS_KEYWORD',
    INPUTS_KEYWORD = 'INPUTS_KEYWORD',
    OUTPUTS_KEYWORD = 'OUTPUTS_KEYWORD',
    PARAMETERS_KEYWORD = 'PARAMETERS_KEYWORD'
}

// Token structure
export interface Token {
    type: TokenType;
    value: string;
    line: number;
    column: number;
}

// AST node types
export enum ASTNodeType {
    PROGRAM = 'PROGRAM',
    VARIABLE_DECLARATION = 'VARIABLE_DECLARATION',
    FUNCTION_CALL = 'FUNCTION_CALL',
    IDENTIFIER = 'IDENTIFIER',
    LITERAL = 'LITERAL',
    NODE_DEFINITION = 'NODE_DEFINITION',
    WORKSPACE_BLOCK = 'WORKSPACE_BLOCK',
    CONNECTIONS_BLOCK = 'CONNECTIONS_BLOCK',
    CONNECTION = 'CONNECTION',
    PORT_REFERENCE = 'PORT_REFERENCE'
}

// AST structure
export interface ASTNode {
    type: ASTNodeType;
    value?: any;
    children?: ASTNode[];
    // Other properties depending on node type
    name?: string;
    arguments?: ASTNode[];
    parameters?: Record<string, ASTNode>;
}

// For function call parsing
export interface FunctionCall {
    name: string;
    arguments: ASTNode[];
    parameters: Record<string, any>;
}

// Parameter definition structure
export interface ParameterDefinitionNode extends ASTNode {
    type: ASTNodeType.LITERAL;
    name: string;
    paramType: string; // 'number', 'text', 'dropdown', 'slider'
    constraints: any[]; // could be min/max for numbers, options for dropdown
}

// Enhanced node definition structure
export interface NodeDefinitionNode extends ASTNode {
    type: ASTNodeType.NODE_DEFINITION;
    name: string;
    inputs: Record<string, string>; // name -> type
    outputs: Record<string, string>; // name -> type
    parameters: Record<string, ParameterDefinitionNode>;
}

// Workspace block structure
export interface WorkspaceBlockNode extends ASTNode {
    type: ASTNodeType.WORKSPACE_BLOCK;
    nodes: NodeDefinitionNode[];
}

// Connections block structure
export interface ConnectionsBlockNode extends ASTNode {
    type: ASTNodeType.CONNECTIONS_BLOCK;
    connections: ConnectionNode[];
}

// Connection structure
export interface ConnectionNode extends ASTNode {
    type: ASTNodeType.CONNECTION;
    from: PortReferenceNode;
    to: PortReferenceNode;
}

// Port reference structure
export interface PortReferenceNode extends ASTNode {
    type: ASTNodeType.PORT_REFERENCE;
    nodeName: string;
    portName: string;
}
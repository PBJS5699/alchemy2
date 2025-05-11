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
    KEYWORD = 'KEYWORD'
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
    NODE_DEFINITION = 'NODE_DEFINITION'
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
  
  // Add new AST node structure for node definition
  export interface NodeDefinitionNode extends ASTNode {
    type: ASTNodeType.NODE_DEFINITION;
    name: string;
    // We'll keep it simple for now
  }
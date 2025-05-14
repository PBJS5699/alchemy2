import { 
  Token, 
  TokenType, 
  ASTNode, 
  ASTNodeType, 
  FunctionCall, 
  NodeDefinitionNode,
  ParameterDefinitionNode,
  WorkspaceBlockNode,
  ConnectionsBlockNode,
  ConnectionNode,
  PortReferenceNode
} from '../../../types/dsl-types';
import { tokenize } from './tokenizer';

export function parse(tokens: Token[]): ASTNode {
  let current = 0;
  
  // Helper to get current token
  const peek = () => tokens[current];
  
  // Helper to advance to next token
  const advance = () => tokens[current++];
  
  // Helper to check if current token matches expected type
  const check = (type: TokenType) => peek()?.type === type;
  
  // Helper to consume a token if it matches expected type
  const consume = (type: TokenType, errorMessage: string) => {
    if (check(type)) {
      return advance();
    }
    throw new Error(errorMessage);
  };

  // Parse a port reference (node.port)
  function parsePortReference(): PortReferenceNode {
    const nodeName = consume(TokenType.IDENTIFIER, "Expected node name").value;
    consume(TokenType.DOT, "Expected '.' after node name");
    const portName = consume(TokenType.IDENTIFIER, "Expected port name").value;
    
    return {
      type: ASTNodeType.PORT_REFERENCE,
      nodeName,
      portName
    };
  }

  // Parse a connection (nodeA.port -> nodeB.port)
  function parseConnection(): ConnectionNode {
    const from = parsePortReference();
    consume(TokenType.ARROW, "Expected '->' between ports");
    const to = parsePortReference();
    
    return {
      type: ASTNodeType.CONNECTION,
      from,
      to
    };
  }

  // Parse connections block
  function parseConnectionsBlock(): ConnectionsBlockNode {
    // Consume 'connections' keyword
    advance();
    consume(TokenType.LEFT_BRACE, "Expected '{' after 'connections'");
    
    const connections: ConnectionNode[] = [];
    
    // Parse connections until we hit closing brace
    while (!check(TokenType.RIGHT_BRACE) && !check(TokenType.EOF)) {
      connections.push(parseConnection());
      
      // Optional semicolon or comma between connections
      if (check(TokenType.SEMICOLON) || check(TokenType.COMMA)) {
        advance();
      }
    }
    
    consume(TokenType.RIGHT_BRACE, "Expected '}' after connections block");
    
    return {
      type: ASTNodeType.CONNECTIONS_BLOCK,
      connections
    };
  }

  // Parse parameter definition
  function parseParameterDefinition(): ParameterDefinitionNode {
    const name = consume(TokenType.IDENTIFIER, "Expected parameter name").value;
    consume(TokenType.COLON, "Expected ':' after parameter name");
    const paramType = consume(TokenType.IDENTIFIER, "Expected parameter type").value;
    
    let constraints: any[] = [];
    
    // Parse optional constraints
    if (check(TokenType.LEFT_PAREN)) {
      advance();
      while (!check(TokenType.RIGHT_PAREN) && !check(TokenType.EOF)) {
        constraints.push(literal());
        if (check(TokenType.COMMA)) advance();
      }
      consume(TokenType.RIGHT_PAREN, "Expected ')' after constraints");
    }
    
    return {
      type: ASTNodeType.LITERAL,
      name,
      paramType,
      constraints
    };
  }

  // Parse node definition
  function parseNodeDefinition(): NodeDefinitionNode {
    // Consume 'node' keyword
    advance();
    
    // Get node name
    const name = consume(TokenType.IDENTIFIER, "Expected node name").value;
    
    // Parse node body
    consume(TokenType.LEFT_BRACE, "Expected '{' after node name");
    
    const inputs: Record<string, string> = {};
    const outputs: Record<string, string> = {};
    const parameters: Record<string, ParameterDefinitionNode> = {};
    
    while (!check(TokenType.RIGHT_BRACE) && !check(TokenType.EOF)) {
      if (check(TokenType.INPUTS_KEYWORD)) {
        advance();
        consume(TokenType.LEFT_BRACE, "Expected '{' after 'inputs'");
        while (!check(TokenType.RIGHT_BRACE) && !check(TokenType.EOF)) {
          const name = consume(TokenType.IDENTIFIER, "Expected input name").value;
          consume(TokenType.COLON, "Expected ':' after input name");
          const type = consume(TokenType.IDENTIFIER, "Expected input type").value;
          inputs[name] = type;
          if (check(TokenType.COMMA)) advance();
        }
        consume(TokenType.RIGHT_BRACE, "Expected '}' after inputs");
      } else if (check(TokenType.OUTPUTS_KEYWORD)) {
        advance();
        consume(TokenType.LEFT_BRACE, "Expected '{' after 'outputs'");
        while (!check(TokenType.RIGHT_BRACE) && !check(TokenType.EOF)) {
          const name = consume(TokenType.IDENTIFIER, "Expected output name").value;
          consume(TokenType.COLON, "Expected ':' after output name");
          const type = consume(TokenType.IDENTIFIER, "Expected output type").value;
          outputs[name] = type;
          if (check(TokenType.COMMA)) advance();
        }
        consume(TokenType.RIGHT_BRACE, "Expected '}' after outputs");
      } else if (check(TokenType.PARAMETERS_KEYWORD)) {
        advance();
        consume(TokenType.LEFT_BRACE, "Expected '{' after 'parameters'");
        while (!check(TokenType.RIGHT_BRACE) && !check(TokenType.EOF)) {
          const param = parseParameterDefinition();
          parameters[param.name] = param;
          if (check(TokenType.COMMA)) advance();
        }
        consume(TokenType.RIGHT_BRACE, "Expected '}' after parameters");
      } else {
        advance(); // Skip unknown tokens
      }
    }
    
    consume(TokenType.RIGHT_BRACE, "Expected '}' after node definition");
    
    return {
      type: ASTNodeType.NODE_DEFINITION,
      name,
      inputs,
      outputs,
      parameters
    };
  }

  // Parse workspace block
  function parseWorkspaceBlock(): WorkspaceBlockNode {
    // Consume 'workspace' keyword
    advance();
    consume(TokenType.LEFT_BRACE, "Expected '{' after 'workspace'");
    
    const nodes: NodeDefinitionNode[] = [];
    
    // Parse nodes until we hit closing brace
    while (!check(TokenType.RIGHT_BRACE) && !check(TokenType.EOF)) {
      if (check(TokenType.NODE_KEYWORD)) {
        nodes.push(parseNodeDefinition() as NodeDefinitionNode);
      } else {
        advance(); // Skip unknown tokens
      }
    }
    
    consume(TokenType.RIGHT_BRACE, "Expected '}' after workspace block");
    
    return {
      type: ASTNodeType.WORKSPACE_BLOCK,
      nodes
    };
  }
  
  // Parse a program
  function program(): ASTNode {
    const statements: ASTNode[] = [];
    
    while (!check(TokenType.EOF)) {
      try {
        statements.push(statement());
      } catch (error) {
        // Skip to the next statement on error
        synchronize();
      }
    }
    
    return {
      type: ASTNodeType.PROGRAM,
      children: statements
    };
  }
  
  // Helper to synchronize after an error
  function synchronize() {
    advance(); // Skip the current token
    
    while (!check(TokenType.EOF)) {
      if (peek().type === TokenType.SEMICOLON) {
        advance();
        return;
      }
      
      advance();
    }
  }
  
  // Parse a statement
  function statement(): ASTNode {
    // Skip comments
    while (check(TokenType.COMMENT)) {
      advance();
    }
    
    // Check for specific block types
    if (check(TokenType.NODE_KEYWORD)) {
      return parseNodeDefinition();
    }
    
    if (check(TokenType.WORKSPACE_KEYWORD)) {
      return parseWorkspaceBlock();
    }
    
    if (check(TokenType.CONNECTIONS_KEYWORD)) {
      return parseConnectionsBlock();
    }
    
    // Variable declaration
    if (check(TokenType.IDENTIFIER) && tokens[current + 1]?.type === TokenType.EQUALS) {
      return variableDeclaration();
    }
    
    // Function call statement
    return {
      type: ASTNodeType.FUNCTION_CALL,
      ...functionCall()
    };
  }
  
  // Parse a variable declaration
  function variableDeclaration(): ASTNode {
    const name = consume(TokenType.IDENTIFIER, "Expected variable name").value;
    consume(TokenType.EQUALS, "Expected '=' after variable name");
    
    // Right side can be a function call
    const initializer = functionCall();
    
    // Optional semicolon
    if (check(TokenType.SEMICOLON)) {
      advance();
    }
    
    return {
      type: ASTNodeType.VARIABLE_DECLARATION,
      name,
      value: {
        type: ASTNodeType.FUNCTION_CALL,
        ...initializer
      }
    };
  }
  
  // Parse a function call
  function functionCall(): FunctionCall {
    const name = consume(TokenType.IDENTIFIER, "Expected function name").value;
    consume(TokenType.LEFT_PAREN, "Expected '(' after function name");
    
    const args: ASTNode[] = [];
    const kwargs: Record<string, any> = {};
    
    // Parse arguments
    if (!check(TokenType.RIGHT_PAREN)) {
      do {
        // Handle named parameters (kwargs)
        if (check(TokenType.IDENTIFIER) && tokens[current + 1]?.type === TokenType.EQUALS) {
          const paramName = advance().value;
          advance(); // Consume the equals sign
          kwargs[paramName] = literal();
        } else {
          // Positional argument
          args.push(literal());
        }
      } while (check(TokenType.COMMA) && advance());
    }
    
    consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
    
    // Optional semicolon
    if (check(TokenType.SEMICOLON)) {
      advance();
    }
    
    return { name, arguments: args, parameters: kwargs };
  }
  
  // Parse a literal value
  function literal(): any {
    if (check(TokenType.NUMBER)) {
      const value = advance().value;
      return parseFloat(value);
    }
    
    if (check(TokenType.STRING)) {
      const value = advance().value;
      // Remove quotes
      return value.substring(1, value.length - 1);
    }
    
    if (check(TokenType.IDENTIFIER)) {
      return {
        type: ASTNodeType.IDENTIFIER,
        value: advance().value
      };
    }
    
    throw new Error(`Unexpected token: ${peek()?.value}`);
  }
  
  // Start parsing
  return program();
}

// Main parse function
export function parseCode(code: string) {
  const tokens = tokenize(code);
  const ast = parse(tokens);
  
  // Convert AST to flow nodes/edges
  // This is simplified for now - we'll implement it properly later
  return {
    nodes: [],
    edges: []
  };
}
import { Token, TokenType } from '../../../types/dsl-types';

export function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let line = 1;
  let column = 1;
  let index = 0;
  
  // Define DSL keywords
  const keywords = new Set([
    'node', 'workspace', 'connections', 
    'inputs', 'outputs', 'parameters'
  ]);
  
  // Helper to add a token
  const addToken = (type: TokenType, value: string) => {
    tokens.push({ type, value, line, column });
    column += value.length;
  };
  
  // Process the code character by character
  while (index < code.length) {
    const char = code[index];
    
    // Handle whitespace
    if (/\s/.test(char)) {
      if (char === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
      index++;
      continue;
    }
    
    // Handle comments
    if (char === '/' && code[index + 1] === '/') {
      const start = index;
      index += 2;
      column += 2;
      
      // Find the end of the line
      while (index < code.length && code[index] !== '\n') {
        index++;
      }
      
      const value = code.substring(start, index);
      addToken(TokenType.COMMENT, value);
      continue;
    }
    
    // Handle arrow token
    if (char === '-' && code[index + 1] === '>') {
      addToken(TokenType.ARROW, '->');
      index += 2;
      column += 2;
      continue;
    }
    
    // Handle identifiers and keywords
    if (/[a-zA-Z_]/.test(char)) {
      const start = index;
      
      // Find the end of the identifier
      while (index < code.length && /[a-zA-Z0-9_]/.test(code[index])) {
        index++;
      }
      
      const value = code.substring(start, index);
      
      // Check if it's a keyword and map to specific keyword type
      if (keywords.has(value)) {
        switch (value) {
          case 'node':
            addToken(TokenType.NODE_KEYWORD, value);
            break;
          case 'workspace':
            addToken(TokenType.WORKSPACE_KEYWORD, value);
            break;
          case 'connections':
            addToken(TokenType.CONNECTIONS_KEYWORD, value);
            break;
          case 'inputs':
            addToken(TokenType.INPUTS_KEYWORD, value);
            break;
          case 'outputs':
            addToken(TokenType.OUTPUTS_KEYWORD, value);
            break;
          case 'parameters':
            addToken(TokenType.PARAMETERS_KEYWORD, value);
            break;
          default:
            addToken(TokenType.KEYWORD, value);
        }
      } else {
        addToken(TokenType.IDENTIFIER, value);
      }
      continue;
    }
    
    // Handle numbers
    if (/[0-9]/.test(char)) {
      const start = index;
      
      // Find the end of the number
      while (index < code.length && /[0-9.]/.test(code[index])) {
        index++;
      }
      
      const value = code.substring(start, index);
      addToken(TokenType.NUMBER, value);
      continue;
    }
    
    // Handle strings
    if (char === '"' || char === "'") {
      const start = index;
      const quote = char;
      index++;
      column++;
      
      // Find the end of the string
      while (index < code.length && code[index] !== quote) {
        if (code[index] === '\n') {
          line++;
          column = 1;
        } else {
          column++;
        }
        index++;
      }
      
      // Include the closing quote
      if (index < code.length) {
        index++;
      }
      
      const value = code.substring(start, index);
      addToken(TokenType.STRING, value);
      continue;
    }
    
    // Handle single-character tokens
    switch (char) {
      case '(':
        addToken(TokenType.LEFT_PAREN, char);
        break;
      case ')':
        addToken(TokenType.RIGHT_PAREN, char);
        break;
      case '{':
        addToken(TokenType.LEFT_BRACE, char);
        break;
      case '}':
        addToken(TokenType.RIGHT_BRACE, char);
        break;
      case '=':
        addToken(TokenType.EQUALS, char);
        break;
      case ',':
        addToken(TokenType.COMMA, char);
        break;
      case ':':
        addToken(TokenType.COLON, char);
        break;
      case ';':
        addToken(TokenType.SEMICOLON, char);
        break;
      case '.':
        addToken(TokenType.DOT, char);
        break;
      default:
        // Skip unknown characters
        column++;
    }
    
    index++;
  }
  
  // Add EOF token
  tokens.push({ type: TokenType.EOF, value: '', line, column });
  
  return tokens;
}
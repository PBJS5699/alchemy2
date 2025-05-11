import { tokenize } from './tokenizer';
import { parse } from './interpreter';
import { ASTNode, ASTNodeType } from '../../../types/dsl-types';
import { NodeDefinition, PortType, ParameterType } from '../../../types/node-types';
import { nodeRegistry } from '../../node-system/node-registry';
import { Position } from 'reactflow';
import { emptyNodeDefinition } from '../../../components/nodes/empty/node-definition';

// Main parse function that converts code to nodes/edges
export function parseCode(code: string) {
  try {
    const tokens = tokenize(code);
    const ast = parse(tokens);
    
    // Process AST to generate nodes and edges
    return processAST(ast);
  } catch (error) {
    console.error('Error parsing code:', error);
    throw error;
  }
}

// Process AST into nodes and edges
function processAST(ast: ASTNode) {
  const nodes: any[] = [];
  const edges: any[] = [];
  const variables: Record<string, string> = {}; // Maps variable names to node IDs
  
  // Position tracking for visual layout
  let xPos = 50;
  let yPos = 50;
  
  // Process each statement in the program
  if (ast.type === ASTNodeType.PROGRAM && ast.children) {
    ast.children.forEach(statement => {
      // Handle node definition
      if (statement.type === ASTNodeType.NODE_DEFINITION) {
        const nodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        
        // For MVP, we'll create an empty node
        nodes.push({
          id: nodeId,
          type: 'empty-node', // Using our empty node type
          position: { x: xPos, y: yPos },
          data: {
            label: statement.name, // Use the node name from the DSL
            parameters: {},
            nodeDef: emptyNodeDefinition
          }
        });
        
        // Update position for next node
        yPos += 150;
      } 
      else if (statement.type === ASTNodeType.VARIABLE_DECLARATION) {
        // Process variable declaration
        const varName = statement.name as string;
        const functionCall = statement.value;
        
        if (functionCall && functionCall.type === ASTNodeType.FUNCTION_CALL) {
          // Create node from function call
          const nodeId = `node_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
          const nodeName = functionCall.name as string;
          
          // Get node definition from registry
          const nodeDef = nodeRegistry.getDefinition(nodeName);
          
          if (nodeDef) {
            // Create node
            nodes.push({
              id: nodeId,
              type: nodeName,
              position: { x: xPos, y: yPos },
              data: {
                label: nodeDef.label,
                parameters: processParameters(functionCall.parameters || {}, nodeDef),
                nodeDef
              }
            });
            
            // Update position for next node
            yPos += 150;
            
            // Store variable name -> node ID mapping
            variables[varName] = nodeId;
            
            // Process connections from args
            if (functionCall.arguments && nodeDef.inputs.length > 0) {
              functionCall.arguments.forEach((arg: ASTNode, index: number) => {
                if (arg.type === ASTNodeType.IDENTIFIER) {
                  const sourceNodeId = variables[arg.value];
                  
                  if (sourceNodeId) {
                    // Get source node definition to use its output handle
                    const sourceNodeType = nodes.find(n => n.id === sourceNodeId)?.type;
                    const sourceNodeDef = sourceNodeType ? nodeRegistry.getDefinition(sourceNodeType) : undefined;
                    const sourceOutputId = sourceNodeDef?.outputs[0]?.id || 'output';
                    
                    // Create edge
                    edges.push({
                      id: `edge_${sourceNodeId}_${nodeId}`,
                      source: sourceNodeId,
                      target: nodeId,
                      sourceHandle: sourceOutputId,
                      targetHandle: nodeDef.inputs[index]?.id || `input_${index}`
                    });
                  }
                }
              });
            }
          }
        }
      }
    });
  }
  
  return { nodes, edges };
}

// Process parameters from AST to node parameters
function processParameters(astParams: Record<string, ASTNode>, nodeDef: NodeDefinition) {
  const result: Record<string, any> = {};
  
  // Start with default values from node definition
  nodeDef.parameters.forEach(param => {
    result[param.id] = param.defaultValue;
  });
  
  // Override with values from AST
  Object.entries(astParams).forEach(([key, value]) => {
    const param = nodeDef.parameters.find(p => p.id === key);
    
    if (param) {
      // Convert value based on parameter type
      switch (param.type) {
        case ParameterType.NUMBER:
        case ParameterType.SLIDER:
          result[key] = typeof value === 'number' ? value : parseFloat(String(value));
          break;
        case ParameterType.TEXT:
          result[key] = String(value);
          break;
        case ParameterType.DROPDOWN:
          result[key] = String(value);
          break;
      }
    }
  });
  
  return result;
}
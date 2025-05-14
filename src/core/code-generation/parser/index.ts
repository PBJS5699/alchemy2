import { tokenize } from './tokenizer';
import { parse } from './interpreter';
import { ASTNode, ASTNodeType, NodeDefinitionNode } from '../../../types/dsl-types';
import { nodeRegistry } from '../../node-system/node-registry';
import { generateNodeDefinition, validateNodeDefinition } from '../../node-system/dynamic-node-generator';
import { processWorkspace } from './workspace-parser';

/**
 * Recursively find all nodes of a specific type in the AST
 */
function findNodesOfType(ast: ASTNode, type: ASTNodeType): ASTNode[] {
  const nodes: ASTNode[] = [];

  function traverse(node: ASTNode) {
    if (node.type === type) {
      nodes.push(node);
    }

    if (node.children) {
      node.children.forEach(traverse);
    }
  }

  traverse(ast);
  return nodes;
}

/**
 * Find all node definitions in the AST
 */
function findNodeDefinitions(ast: ASTNode): NodeDefinitionNode[] {
  return findNodesOfType(ast, ASTNodeType.NODE_DEFINITION) as NodeDefinitionNode[];
}

/**
 * Find the workspace block in the AST
 */
function findWorkspaceBlock(ast: ASTNode): ASTNode | undefined {
  return findNodesOfType(ast, ASTNodeType.WORKSPACE_BLOCK)[0];
}

/**
 * Find the connections block in the AST
 */
function findConnectionsBlock(ast: ASTNode): ASTNode | undefined {
  return findNodesOfType(ast, ASTNodeType.CONNECTIONS_BLOCK)[0];
}

/**
 * Process node definitions and register them with the node registry
 */
function processNodeDefinitions(nodeDefinitions: NodeDefinitionNode[]) {
  nodeDefinitions.forEach(nodeDef => {
    try {
      // Validate the node definition
      validateNodeDefinition(nodeDef);

      // Generate the node definition and register it
      const definition = generateNodeDefinition(nodeDef);
      nodeRegistry.registerDynamicNode(definition);
    } catch (error) {
      console.error(`Error processing node definition ${nodeDef.name}:`, error);
      throw error;
    }
  });
}

interface ParseResult {
  nodes: Array<{
    id: string;
    type: string;
    data: any;
    position: { x: number; y: number };
  }>;
  edges: Array<{
    id: string;
    source: string;
    sourceHandle: string;
    target: string;
    targetHandle: string;
  }>;
  errors?: Array<{
    message: string;
    line?: number;
    column?: number;
  }>;
}

/**
 * Main entry point for parsing DSL code
 */
export function parseCode(code: string): ParseResult {
  try {
    // Clear any previously registered dynamic nodes
    nodeRegistry.clearDynamicNodes();

    // First pass: Tokenize and parse the code into an AST
    const tokens = tokenize(code);
    const ast = parse(tokens);

    // Second pass: Find and process node definitions
    const nodeDefinitions = findNodeDefinitions(ast);
    processNodeDefinitions(nodeDefinitions);

    // Third pass: Process workspace and connections
    const workspaceBlock = findWorkspaceBlock(ast);
    const connectionsBlock = findConnectionsBlock(ast);

    if (!workspaceBlock) {
      return { nodes: [], edges: [], errors: [{ message: 'No workspace block found' }] };
    }

    // Process the workspace and connections together
    const { nodes, edges } = processWorkspace(workspaceBlock, connectionsBlock);

    return { nodes, edges };
  } catch (error) {
    console.error('Error parsing code:', error);
    
    // Return a structured error object
    return {
      nodes: [],
      edges: [],
      errors: [{
        message: error instanceof Error ? error.message : 'Unknown error during parsing',
        line: (error as any)?.line,
        column: (error as any)?.column
      }]
    };
  }
}

/**
 * Parse a single node definition string
 * Useful for testing or when receiving individual node definitions
 */
export function parseNodeDefinition(code: string): NodeDefinitionNode {
  const tokens = tokenize(code);
  const ast = parse(tokens);

  const nodeDefinitions = findNodeDefinitions(ast);
  if (nodeDefinitions.length !== 1) {
    throw new Error('Expected exactly one node definition');
  }

  return nodeDefinitions[0];
}
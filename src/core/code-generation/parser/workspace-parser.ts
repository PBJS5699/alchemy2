import { 
  ASTNode, 
  ASTNodeType, 
  WorkspaceBlockNode, 
  ConnectionsBlockNode,
  NodeDefinitionNode,
  ConnectionNode
} from '../../../types/dsl-types';
import { nodeRegistry } from '../../node-system/node-registry';
import { generateNodeDefinition } from '../../node-system/dynamic-node-generator';
import { NodeData } from '../../../types/node-types';

interface NodeInstance {
  id: string;
  type: string;
  data: NodeData;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
}

interface WorkspaceResult {
  nodes: NodeInstance[];
  edges: Edge[];
}

/**
 * Process a workspace block AST node into a list of node instances
 * @param workspaceNode - The workspace block AST node
 * @returns An array of node instances
 */
export function processWorkspaceBlock(workspaceNode: ASTNode): NodeInstance[] {
  // Ensure we have a workspace block
  if (workspaceNode.type !== ASTNodeType.WORKSPACE_BLOCK) {
    throw new Error('Expected workspace block node');
  }

  const workspaceBlock = workspaceNode as WorkspaceBlockNode;
  const nodes: NodeInstance[] = [];

  // Process each node definition in the workspace
  workspaceBlock.nodes.forEach((nodeDefinition, index) => {
    // Register the node type if it's not already registered
    if (!nodeRegistry.hasNodeType(nodeDefinition.name)) {
      const definition = generateNodeDefinition(nodeDefinition);
      nodeRegistry.registerDynamicNode(definition);
    }

    // Get the registered definition
    const registeredDef = nodeRegistry.getDefinition(nodeDefinition.name);
    if (!registeredDef) {
      throw new Error(`Node definition not found for ${nodeDefinition.name}`);
    }

    // Create a node instance
    nodes.push({
      id: `node_${index}`,
      type: nodeDefinition.name,
      data: {
        label: nodeDefinition.name,
        nodeDef: registeredDef,
        parameters: Object.fromEntries(
          registeredDef.parameters.map(param => [
            param.name,
            // Use first constraint as default if available
            nodeDefinition.parameters[param.name]?.constraints[0] || null
          ])
        ),
        isDynamic: true,
        originalDefinition: nodeDefinition
      },
      // Simple grid layout - can be improved later
      position: {
        x: (index % 3) * 250,
        y: Math.floor(index / 3) * 150
      }
    });
  });

  return nodes;
}

/**
 * Process a connections block AST node into a list of edges
 * @param connectionsNode - The connections block AST node
 * @param nodeMap - A map of node names to node IDs
 * @returns An array of edges
 */
export function processConnectionsBlock(connectionsNode: ASTNode, nodeMap: Map<string, string>): Edge[] {
  // Ensure we have a connections block
  if (connectionsNode.type !== ASTNodeType.CONNECTIONS_BLOCK) {
    throw new Error('Expected connections block node');
  }

  const connectionsBlock = connectionsNode as ConnectionsBlockNode;
  const edges: Edge[] = [];

  // Process each connection in the block
  connectionsBlock.connections.forEach((connection, index) => {
    const sourceNodeId = nodeMap.get(connection.from.nodeName);
    const targetNodeId = nodeMap.get(connection.to.nodeName);

    if (!sourceNodeId || !targetNodeId) {
      throw new Error(`Node not found: ${connection.from.nodeName} or ${connection.to.nodeName}`);
    }

    edges.push({
      id: `edge_${index}`,
      source: sourceNodeId,
      sourceHandle: connection.from.portName,
      target: targetNodeId,
      targetHandle: connection.to.portName
    });
  });

  return edges;
}

/**
 * Process both workspace and connections blocks to create a complete workspace
 * @param workspaceNode - The workspace block AST node
 * @param connectionsNode - The connections block AST node (optional)
 * @returns A complete workspace with nodes and edges
 */
export function processWorkspace(workspaceNode: ASTNode, connectionsNode?: ASTNode): WorkspaceResult {
  // Process the workspace block to get node instances
  const nodes = processWorkspaceBlock(workspaceNode);
  
  // Create a map of node names to IDs for connection processing
  const nodeMap = new Map<string, string>();
  nodes.forEach(node => {
    // Extract original node name from the node definition
    const nodeDefinition = (workspaceNode as WorkspaceBlockNode).nodes.find(
      def => def.name === node.type
    );
    if (nodeDefinition) {
      nodeMap.set(nodeDefinition.name, node.id);
    }
  });

  // Process the connections block if provided
  const edges = connectionsNode ? processConnectionsBlock(connectionsNode, nodeMap) : [];

  return { nodes, edges };
} 
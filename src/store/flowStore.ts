import { create } from 'zustand';
import { 
  Node, 
  Edge, 
  addEdge, 
  Connection,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges
} from 'reactflow';
import { NodeData } from '../types/node-types';

interface FlowState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (nodeType: string, position: { x: number, y: number }) => void;
  updateNodeParameters: (nodeId: string, parameters: Record<string, any>) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    // We'll implement connection type validation later
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  
  addNode: (nodeType, position) => {
    // We'll get the node definition from the registry later
    const newNode: Node<NodeData> = {
      id: `node_${Date.now()}`,
      type: nodeType,
      position,
      data: {
        label: nodeType,
        parameters: {},
      },
    };
    
    set({
      nodes: [...get().nodes, newNode],
    });
  },
  
  updateNodeParameters: (nodeId, parameters) => {
    set({
      nodes: get().nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              parameters: {
                ...node.data.parameters,
                ...parameters
              }
            }
          };
        }
        return node;
      })
    });
  },
}));
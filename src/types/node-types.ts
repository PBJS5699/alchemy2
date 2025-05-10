import { Node, Edge } from 'reactflow';

// Parameter types
export enum ParameterType {
  TEXT = 'text',
  NUMBER = 'number',
  SLIDER = 'slider',
  DROPDOWN = 'dropdown'
}

// Port/Handle data types
export enum PortType {
  IMAGE = 'image',
  NUMBER = 'number',
  BINARY = 'binary',
  ARRAY = 'array',
  OBJECT = 'object',
  ANY = 'any'
}

// Parameter definition
export interface ParameterDefinition {
  id: string;
  label: string;
  type: ParameterType;
  defaultValue: any;
  options?: string[]; // For dropdown
  min?: number; // For slider and number
  max?: number; // For slider and number
  step?: number; // For slider and number
}

// Port/Handle definition
export interface PortDefinition {
  id: string;
  label: string;
  type: PortType;
  multiple?: boolean;
}

// Node definition
export interface NodeDefinition {
  type: string;
  label: string;
  category: string;
  description: string;
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  parameters: ParameterDefinition[];
  // This would be extended for backend processing later
}

// Node data that will be stored in ReactFlow nodes
export interface NodeData {
  label: string;
  parameters: Record<string, any>;
  nodeDef?: NodeDefinition;
}

// Type for our ReactFlow nodes
export type FlowNode = Node<NodeData>;

// Node registry entry
export interface NodeRegistryEntry {
  definition: NodeDefinition;
  component: React.ComponentType<any>;
  // This would include processor functions in the future
}
import React from 'react';
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

/**
 * Parameter definition interface
 * Primary properties are name, type, displayName, description, constraints
 * Other properties are for backward compatibility or specific parameter types
 */
export interface ParameterDefinition {
  // Core properties
  name: string;               // Unique identifier for this parameter
  type: ParameterType;        // Type of parameter (text, number, etc.)
  displayName: string;        // User-friendly name
  description: string;        // Description of the parameter
  constraints: any[];         // Constraints on parameter values

  // Backward compatibility
  id: string;                 // Backward compatibility (same as name)
  label?: string;             // Backward compatibility (same as displayName)

  // Optional properties depending on parameter type
  defaultValue?: any;         // Default value
  min?: number;               // For NUMBER and SLIDER: minimum value
  max?: number;               // For NUMBER and SLIDER: maximum value
  step?: number;              // For NUMBER and SLIDER: step increment
  options?: string[];         // For DROPDOWN: available options
}

/**
 * Port/Handle definition interface
 * Primary properties are name, type, displayName, description
 * Other properties are for backward compatibility
 */
export interface PortDefinition {
  // Core properties
  name: string;               // Unique identifier for this port
  type: PortType;             // Type of data accepted/provided by this port
  displayName: string;        // User-friendly name
  description: string;        // Description of the port

  // Backward compatibility
  id?: string;                // Backward compatibility (same as name)
  label?: string;             // Backward compatibility (same as displayName)
}

/**
 * Node definition interface
 * Defines the structure and behavior of a node type
 */
export interface NodeDefinition {
  type: string;               // Unique identifier for the node type
  category: string;           // Category for organization in the node palette
  description: string;        // Description of what the node does
  icon?: string;              // Optional icon identifier
  inputs: PortDefinition[];   // Input ports
  outputs: PortDefinition[];  // Output ports
  parameters: ParameterDefinition[]; // Configurable parameters
}

/**
 * Node data that will be stored in ReactFlow nodes
 * Contains runtime data for node instances
 */
export interface NodeData {
  label: string;              // Display name for the node
  parameters: Record<string, any>; // Current parameter values
  nodeDef?: NodeDefinition;   // Reference to the node definition
  className?: string;         // Optional CSS class name for styling
  onParameterChange?: (nodeId: string, paramName: string, value: any) => void; // Handler for parameter changes
  isDynamic?: boolean;        // Flag for dynamically generated nodes
  originalDefinition?: any;   // Original AST node definition
}

// Type for our ReactFlow nodes
export type FlowNode = Node<NodeData>;

/**
 * Node registry entry
 * Contains the definition and component for a node type
 */
export interface NodeRegistryEntry {
  definition: NodeDefinition;
  component: React.ComponentType<any>;
}
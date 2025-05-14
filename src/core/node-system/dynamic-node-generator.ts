/**
 * Utilities for creating NodeDefinition objects from parsed
 * node definitions in the DSL. Converts AST node structures
 * into proper type definitions that can be registered.
 */
import { NodeDefinitionNode, ParameterDefinitionNode } from '../../types/dsl-types';
import { NodeDefinition, ParameterDefinition, PortDefinition, ParameterType, PortType } from '../../types/node-types';

/**
 * Maps DSL parameter types to internal parameter types
 */
function mapParameterType(dslType: string): ParameterType {
  switch (dslType.toLowerCase()) {
    case 'number':
      return ParameterType.NUMBER;
    case 'text':
      return ParameterType.TEXT;
    case 'slider':
      return ParameterType.SLIDER;
    case 'dropdown':
      return ParameterType.DROPDOWN;
    default:
      return ParameterType.TEXT;
  }
}

/**
 * Maps DSL port types to internal port types
 */
function mapPortType(dslType: string): PortType {
  switch (dslType.toLowerCase()) {
    case 'image':
      return PortType.IMAGE;
    case 'number':
      return PortType.NUMBER;
    case 'binary':
      return PortType.BINARY;
    case 'array':
      return PortType.ARRAY;
    case 'object':
      return PortType.OBJECT;
    default:
      return PortType.ANY;
  }
}

/**
 * Creates a port definition from a DSL port specification
 */
function createPortDefinition(name: string, type: string): PortDefinition {
  return {
    name,                   // Primary identifier 
    id: name,               // For backward compatibility
    type: mapPortType(type),
    displayName: name,      // User-friendly name
    label: name,            // For backward compatibility
    description: `${name} port of type ${type}`
  };
}

/**
 * Creates a parameter definition from a DSL parameter node
 */
function createParameterDefinition(param: ParameterDefinitionNode): ParameterDefinition {
  // Determine if this is a slider parameter
  const isSlider = param.paramType.toLowerCase() === 'slider';
  const isNumber = param.paramType.toLowerCase() === 'number';
  const isDropdown = param.paramType.toLowerCase() === 'dropdown';
  
  // Extract constraints
  const constraints = param.constraints || [];
  
  // Create default properties
  const result: ParameterDefinition = {
    name: param.name,       // Primary identifier
    id: param.name,         // For backward compatibility
    type: mapParameterType(param.paramType),
    displayName: param.name, // User-friendly name
    label: param.name,       // For backward compatibility
    description: `Parameter ${param.name} of type ${param.paramType}`,
    constraints,
    defaultValue: constraints.length > 0 ? constraints[0] : undefined
  };
  
  // Add type-specific properties
  if (isSlider || isNumber) {
    if (constraints.length >= 2) {
      result.min = Number(constraints[0]);
      result.max = Number(constraints[1]);
    }
    if (constraints.length >= 3) {
      result.step = Number(constraints[2]);
    }
  } else if (isDropdown && constraints.length > 0) {
    result.options = constraints.map(item => String(item));
  }
  
  return result;
}

/**
 * Creates a complete node definition from an AST node definition
 */
export function generateNodeDefinition(astNode: NodeDefinitionNode): NodeDefinition {
  // Convert inputs
  const inputs = Object.entries(astNode.inputs).map(
    ([name, type]) => createPortDefinition(name, type)
  );

  // Convert outputs
  const outputs = Object.entries(astNode.outputs).map(
    ([name, type]) => createPortDefinition(name, type)
  );

  // Convert parameters
  const parameters = Object.values(astNode.parameters).map(
    param => createParameterDefinition(param)
  );

  return {
    type: astNode.name,
    category: 'dynamic',
    description: `Dynamically defined ${astNode.name} node`,
    inputs,
    outputs,
    parameters
  };
}

/**
 * Validates a node definition AST node
 * Returns true if valid, throws error if invalid
 */
export function validateNodeDefinition(astNode: NodeDefinitionNode): boolean {
  // Check required fields
  if (!astNode.name) {
    throw new Error('Node definition must have a name');
  }

  // Validate inputs
  Object.entries(astNode.inputs).forEach(([name, type]) => {
    if (!name || !type) {
      throw new Error(`Invalid input definition in node ${astNode.name}`);
    }
  });

  // Validate outputs
  Object.entries(astNode.outputs).forEach(([name, type]) => {
    if (!name || !type) {
      throw new Error(`Invalid output definition in node ${astNode.name}`);
    }
  });

  // Validate parameters
  Object.values(astNode.parameters).forEach(param => {
    if (!param.name || !param.paramType) {
      throw new Error(`Invalid parameter definition in node ${astNode.name}`);
    }
  });

  return true;
} 
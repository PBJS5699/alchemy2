import { NodeDefinition, ParameterType, PortType } from '../../../types/node-types';

export const emptyNodeDefinition: NodeDefinition = {
  type: 'empty-node',
  label: 'Empty Node',
  category: 'basic',
  description: 'An empty node with no inputs, outputs, or parameters',
  inputs: [],
  outputs: [],
  parameters: []
}; 
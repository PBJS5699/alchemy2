import { NodeDefinition, ParameterType, PortType } from '../../../types/node-types';

export const emptyNodeDefinition: NodeDefinition = {
  type: 'empty-node',
  category: 'basic',
  description: 'An empty node for testing',
  inputs: [],
  outputs: [],
  parameters: []
}; 
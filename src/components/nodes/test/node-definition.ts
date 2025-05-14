import { NodeDefinition, ParameterType, PortType } from '../../../types/node-types';

export const testNodeDefinition: NodeDefinition = {
  type: 'test-node',
  category: 'testing',
  description: 'A test node for development',
  
  // Inputs
  inputs: [
    {
      id: 'input1',
      name: 'input1',
      displayName: 'Input 1',
      label: 'Input 1',
      type: PortType.ANY,
      description: 'First input'
    },
    {
      id: 'input2',
      name: 'input2',
      displayName: 'Input 2',
      label: 'Input 2',
      type: PortType.ANY,
      description: 'Second input'
    }
  ],
  
  // Outputs
  outputs: [
    {
      id: 'output1',
      name: 'output1',
      displayName: 'Output 1',
      label: 'Output 1',
      type: PortType.ANY,
      description: 'First output'
    },
    {
      id: 'output2',
      name: 'output2',
      displayName: 'Output 2',
      label: 'Output 2',
      type: PortType.ANY,
      description: 'Second output'
    }
  ],
  
  // Parameters
  parameters: [
    {
      id: 'textParam',
      name: 'textParam',
      displayName: 'Text Parameter',
      label: 'Text Parameter',
      type: ParameterType.TEXT,
      description: 'A text parameter',
      defaultValue: 'Default text',
      constraints: []
    },
    {
      id: 'numberParam',
      name: 'numberParam',
      displayName: 'Number Parameter',
      label: 'Number Parameter',
      type: ParameterType.NUMBER,
      description: 'A number parameter',
      defaultValue: 42,
      constraints: []
    },
    {
      id: 'sliderParam',
      name: 'sliderParam',
      displayName: 'Slider Parameter',
      label: 'Slider Parameter',
      type: ParameterType.SLIDER,
      description: 'A slider parameter',
      defaultValue: 50,
      min: 0,
      max: 100,
      step: 1,
      constraints: []
    },
    {
      id: 'dropdownParam',
      name: 'dropdownParam',
      displayName: 'Dropdown Parameter',
      label: 'Dropdown Parameter',
      type: ParameterType.DROPDOWN,
      description: 'A dropdown parameter',
      defaultValue: 'option1',
      options: ['option1', 'option2', 'option3'],
      constraints: []
    }
  ]
};
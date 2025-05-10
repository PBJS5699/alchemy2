import { NodeDefinition, ParameterType, PortType } from '../../../types/node-types';

export const testNodeDefinition: NodeDefinition = {
  type: 'test-node',
  label: 'Test Node',
  category: 'test',
  description: 'A test node with various parameter types',
  inputs: [
    {
      id: 'input1',
      label: 'Input 1',
      type: PortType.ANY
    },
    {
      id: 'input2',
      label: 'Input 2',
      type: PortType.ANY
    }
  ],
  outputs: [
    {
      id: 'output1',
      label: 'Output 1',
      type: PortType.ANY
    },
    {
      id: 'output2',
      label: 'Output 2',
      type: PortType.ANY
    }
  ],
  parameters: [
    {
      id: 'textParam',
      label: 'Text Parameter',
      type: ParameterType.TEXT,
      defaultValue: 'Default text'
    },
    {
      id: 'numberParam',
      label: 'Number Parameter',
      type: ParameterType.NUMBER,
      defaultValue: 42
    },
    {
      id: 'sliderParam',
      label: 'Slider Parameter',
      type: ParameterType.SLIDER,
      defaultValue: 50,
      min: 0,
      max: 100,
      step: 1
    },
    {
      id: 'dropdownParam',
      label: 'Dropdown Parameter',
      type: ParameterType.DROPDOWN,
      defaultValue: 'option1',
      options: ['option1', 'option2', 'option3']
    }
  ]
};
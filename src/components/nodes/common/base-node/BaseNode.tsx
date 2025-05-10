import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, PortDefinition } from '../../../../types/node-types';
import TextParameter from '../parameters/TextParameter';
import NumberParameter from '../parameters/NumberParameter';
import SliderParameter from '../parameters/SliderParameter';
import DropdownParameter from '../parameters/DropdownParameter';

const BaseNode: React.FC<NodeProps<NodeData>> = ({ id, data, isConnectable }) => {
  const { label, parameters, nodeDef } = data;
  
  if (!nodeDef) {
    return <div className="p-2 border border-red-500 rounded">Invalid Node</div>;
  }
  
  // Render input handles
  const renderInputHandles = () => {
    return nodeDef.inputs.map((input: PortDefinition, index: number) => (
      <Handle
        key={input.id}
        type="target"
        position={Position.Left}
        id={input.id}
        className={`w-3 h-3 bg-blue-500`}
        isConnectable={isConnectable}
        style={{ top: 50 + index * 20 }}
      >
        <div className="absolute left-4 text-xs whitespace-nowrap">{input.label}</div>
      </Handle>
    ));
  };
  
  // Render output handles
  const renderOutputHandles = () => {
    return nodeDef.outputs.map((output: PortDefinition, index: number) => (
      <Handle
        key={output.id}
        type="source"
        position={Position.Right}
        id={output.id}
        className={`w-3 h-3 bg-green-500`}
        isConnectable={isConnectable}
        style={{ top: 50 + index * 20 }}
      >
        <div className="absolute right-4 text-xs whitespace-nowrap">{output.label}</div>
      </Handle>
    ));
  };
  
  // Render parameters
  const renderParameters = () => {
    return nodeDef.parameters.map(param => {
      const value = parameters[param.id] !== undefined ? parameters[param.id] : param.defaultValue;
      
      switch (param.type) {
        case 'text':
          return (
            <TextParameter
              key={param.id}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        case 'number':
          return (
            <NumberParameter
              key={param.id}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        case 'slider':
          return (
            <SliderParameter
              key={param.id}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        case 'dropdown':
          return (
            <DropdownParameter
              key={param.id}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        default:
          return null;
      }
    });
  };
  
  return (
    <div className="p-2 border border-gray-300 rounded bg-white shadow-md min-w-[200px]">
      <div className="font-bold text-center border-b border-gray-300 pb-2">
        {label}
      </div>
      
      <div className="mt-2 space-y-2">
        {renderParameters()}
      </div>
      
      {renderInputHandles()}
      {renderOutputHandles()}
    </div>
  );
};

export default BaseNode;
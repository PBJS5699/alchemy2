import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { NodeData, PortDefinition, ParameterDefinition, ParameterType } from '../../../../types/node-types';
import TextParameter from '../parameters/TextParameter';
import NumberParameter from '../parameters/NumberParameter';
import SliderParameter from '../parameters/SliderParameter';
import DropdownParameter from '../parameters/DropdownParameter';

interface BaseNodeProps extends NodeProps<NodeData> {
  children?: React.ReactNode;
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, data, isConnectable, children }) => {
  const { label, parameters, nodeDef, className } = data;
  
  if (!nodeDef) {
    return <div className="p-2 border border-red-500 rounded">Invalid Node</div>;
  }
  
  // Render input handles
  const renderInputHandles = () => {
    return nodeDef.inputs.map((input: PortDefinition, index: number) => (
      <Handle
        key={input.name}
        type="target"
        position={Position.Left}
        id={input.name}
        className={`w-3 h-3 bg-blue-500`}
        isConnectable={isConnectable}
        style={{ top: 50 + index * 20 }}
      >
        <div className="absolute left-4 text-xs whitespace-nowrap">{input.displayName}</div>
      </Handle>
    ));
  };
  
  // Render output handles
  const renderOutputHandles = () => {
    return nodeDef.outputs.map((output: PortDefinition, index: number) => (
      <Handle
        key={output.name}
        type="source"
        position={Position.Right}
        id={output.name}
        className={`w-3 h-3 bg-green-500`}
        isConnectable={isConnectable}
        style={{ top: 50 + index * 20 }}
      >
        <div className="absolute right-4 text-xs whitespace-nowrap">{output.displayName}</div>
      </Handle>
    ));
  };
  
  // Render parameters
  const renderParameters = () => {
    return nodeDef.parameters.map(param => {
      // Use the parameter value if available, or fall back to defaultValue
      const value = parameters[param.name] !== undefined 
        ? parameters[param.name] 
        : param.defaultValue;
      
      switch (param.type) {
        case ParameterType.TEXT:
          return (
            <TextParameter
              key={param.name}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        case ParameterType.NUMBER:
          return (
            <NumberParameter
              key={param.name}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        case ParameterType.SLIDER:
          return (
            <SliderParameter
              key={param.name}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        case ParameterType.DROPDOWN:
          return (
            <DropdownParameter
              key={param.name}
              nodeId={id}
              param={param}
              value={value}
            />
          );
        default:
          // Handle unknown parameter types
          console.warn(`Unknown parameter type: ${param.type} for parameter ${param.name}`);
          return null;
      }
    });
  };
  
  return (
    <div className={`p-2 border border-gray-300 rounded bg-white shadow-md min-w-[200px] ${className || ''}`}>
      <div className="font-bold text-center border-b border-gray-300 pb-2">
        {label}
      </div>
      
      <div className="mt-2 space-y-2">
        {renderParameters()}
      </div>
      
      {children}
      
      {renderInputHandles()}
      {renderOutputHandles()}
    </div>
  );
};

export default BaseNode;
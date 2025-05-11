import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { NodeData } from '../../../types/node-types';

/**
 * FallbackNode is used when a node type in the code doesn't have a registered component
 */
const FallbackNode: React.FC<NodeProps<NodeData>> = ({ data, id }) => {
  const { parameters, label, nodeDef } = data;

  return (
    <div className="p-3 rounded-md bg-slate-100 border border-slate-300 min-w-[180px] shadow-md">
      <div className="font-semibold text-center border-b border-slate-300 pb-2 mb-2">
        {label || 'Dynamic Node'}
      </div>
      
      {/* Input handles */}
      {nodeDef?.inputs.map((input, index) => (
        <Handle
          key={input.id || `input-${index}`}
          type="target"
          position={Position.Left}
          id={input.id || `input-${index}`}
          style={{ top: 50 + index * 20 }}
          className="w-3 h-3 bg-blue-500"
        />
      ))}
      
      {/* Parameters */}
      <div className="p-2">
        {Object.entries(parameters || {}).map(([key, value]) => (
          <div key={key} className="mb-1 text-sm">
            <span className="font-medium">{key}: </span>
            <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
          </div>
        ))}
      </div>
      
      {/* Output handles */}
      {nodeDef?.outputs.map((output, index) => (
        <Handle
          key={output.id || `output-${index}`}
          type="source"
          position={Position.Right}
          id={output.id || `output-${index}`}
          style={{ top: 50 + index * 20 }}
          className="w-3 h-3 bg-green-500"
        />
      ))}
    </div>
  );
};

export default FallbackNode; 
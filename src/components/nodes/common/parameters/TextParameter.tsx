import React from 'react';
import { ParameterDefinition } from '../../../../types/node-types';
import { useFlowStore } from '../../../../store/flowStore';
import './Parameters.css';

interface TextParameterProps {
  nodeId: string;
  param: ParameterDefinition;
  value: string;
}

const TextParameter: React.FC<TextParameterProps> = ({ nodeId, param, value }) => {
  const updateNodeParameters = useFlowStore(state => state.updateNodeParameters);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeParameters(nodeId, { [param.id]: e.target.value });
  };
  
  return (
    <div className="parameter">
      <div className="parameter-container">
        <span className="parameter-label">{param.label}</span>
        <input
          type="text"
          className="parameter-input"
          value={value || ""}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};

export default TextParameter;
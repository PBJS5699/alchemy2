import React from 'react';
import { ParameterDefinition } from '../../../../types/node-types';
import { useFlowStore } from '../../../../store/flowStore';
import './Parameters.css';

interface NumberParameterProps {
  nodeId: string;
  param: ParameterDefinition;
  value: number;
}

const NumberParameter: React.FC<NumberParameterProps> = ({ nodeId, param, value }) => {
  const updateNodeParameters = useFlowStore(state => state.updateNodeParameters);
  
  const handleChange = (val: any) => {
    // If val is an event object, extract value from target
    const newValue = val && val.target 
      ? val.target.value === '' ? (param.min || 0) : parseFloat(val.target.value)
      : val === '' ? (param.min || 0) : parseFloat(val);
    
    if (!isNaN(newValue)) {
      const min = param.min !== undefined ? param.min : Number.MIN_SAFE_INTEGER;
      const max = param.max !== undefined ? param.max : Number.MAX_SAFE_INTEGER;
      
      updateNodeParameters(nodeId, { 
        [param.id]: Math.min(Math.max(newValue, min), max)
      });
    }
  };
  
  return (
    <div className="parameter">
      <div className="parameter-container">
        <span className="parameter-label">{param.label}</span>
        <input
          type="number"
          className="parameter-input"
          value={value}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          min={param.min}
          max={param.max}
          step={param.step || 1}
        />
      </div>
    </div>
  );
};

export default NumberParameter;
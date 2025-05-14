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
  
  // Use consistent parameter name property (matching the NodeDefinition interface)
  const paramName = param.name || param.id;
  const displayName = param.displayName || param.label || paramName;
  
  // Get min, max, step values with proper fallbacks
  const min = param.min !== undefined ? param.min : Number.MIN_SAFE_INTEGER;
  const max = param.max !== undefined ? param.max : Number.MAX_SAFE_INTEGER;
  const step = param.step !== undefined ? param.step : 1;
  
  const handleChange = (val: any) => {
    // If val is an event object, extract value from target
    const newValue = val && val.target 
      ? val.target.value === '' ? min : parseFloat(val.target.value)
      : val === '' ? min : parseFloat(val);
    
    if (!isNaN(newValue)) {
      updateNodeParameters(nodeId, { 
        [paramName]: Math.min(Math.max(newValue, min), max)
      });
    }
  };
  
  return (
    <div className="parameter">
      <div className="parameter-container">
        <span className="parameter-label">{displayName}</span>
        <input
          type="number"
          className="parameter-input"
          value={value !== undefined ? value : param.defaultValue || 0}
          onChange={handleChange}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          min={min}
          max={max}
          step={step}
        />
      </div>
    </div>
  );
};

export default NumberParameter;
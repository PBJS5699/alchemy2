import React from 'react';
import { ParameterDefinition } from '../../../../types/node-types';
import { useFlowStore } from '../../../../store/flowStore';
import './Parameters.css';

interface SliderParameterProps {
  nodeId: string;
  param: ParameterDefinition;
  value: number;
}

const SliderParameter: React.FC<SliderParameterProps> = ({ nodeId, param, value }) => {
  const updateNodeParameters = useFlowStore(state => state.updateNodeParameters);
  
  // Use consistent parameter name property (matching the NodeDefinition interface)
  const paramName = param.name || param.id;
  const displayName = param.displayName || param.label || paramName;
  
  // Get min, max, step values with proper fallbacks
  const min = param.min !== undefined ? param.min : 0;
  const max = param.max !== undefined ? param.max : 100;
  const step = param.step !== undefined ? param.step : 1;
  
  // Ensure value is within bounds and handle undefined
  const currentValue = value !== undefined
    ? Math.min(Math.max(value, min), max)
    : param.defaultValue !== undefined 
      ? param.defaultValue 
      : (min + max) / 2; // Default to middle of range
  
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
  
  // Handle all pointer events to prevent node dragging
  const preventPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Prevent the parent node from being dragged
    if (e.currentTarget.parentNode) {
      (e.currentTarget.parentNode as HTMLElement).style.pointerEvents = 'none';
    }
  };

  // Restore pointer events when done
  const restorePointerEvents = (e: React.MouseEvent) => {
    if (e.currentTarget.parentNode) {
      (e.currentTarget.parentNode as HTMLElement).style.pointerEvents = 'auto';
    }
  };
  
  return (
    <div className="parameter">
      <div className="parameter-container slider-container">
        <div className="slider-header">
          <span className="parameter-label">{displayName}</span>
          <input
            type="number"
            className="parameter-input"
            value={currentValue}
            onChange={handleChange}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            min={min}
            max={max}
            step={step}
          />
        </div>
        <div className="slider-row">
          <input
            type="range"
            className="parameter-slider"
            value={currentValue}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              updateNodeParameters(nodeId, { [paramName]: newValue });
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              e.stopPropagation();
              preventPropagation(e);
            }}
            onMouseUp={restorePointerEvents}
            onMouseLeave={restorePointerEvents}
            onDragStart={(e) => e.stopPropagation()}
            min={min}
            max={max}
            step={step}
          />
        </div>
      </div>
    </div>
  );
};

export default SliderParameter;
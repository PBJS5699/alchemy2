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
  
  const handleChange = (val: any) => {
    // If val is an event object, extract value from target
    const newValue = val && val.target 
      ? val.target.value === '' ? (param.min || 0) : parseFloat(val.target.value)
      : val === '' ? (param.min || 0) : parseFloat(val);
    
    if (!isNaN(newValue)) {
      const min = param.min !== undefined ? param.min : 0;
      const max = param.max !== undefined ? param.max : 100;
      
      updateNodeParameters(nodeId, { 
        [param.id]: Math.min(Math.max(newValue, min), max)
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
        <div className="slider-row">
          <input
            type="range"
            className="parameter-slider"
            value={value}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value);
              updateNodeParameters(nodeId, { [param.id]: newValue });
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => {
              e.stopPropagation();
              preventPropagation(e);
            }}
            onMouseUp={restorePointerEvents}
            onMouseLeave={restorePointerEvents}
            onDragStart={(e) => e.stopPropagation()}
            min={param.min !== undefined ? param.min : 0}
            max={param.max !== undefined ? param.max : 100}
            step={param.step || 1}
          />
        </div>
      </div>
    </div>
  );
};

export default SliderParameter;
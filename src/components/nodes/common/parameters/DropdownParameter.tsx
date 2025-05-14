import React, { useState, useRef, useEffect } from 'react';
import { ParameterDefinition } from '../../../../types/node-types';
import { useFlowStore } from '../../../../store/flowStore';
import './Parameters.css';

interface DropdownParameterProps {
  nodeId: string;
  param: ParameterDefinition;
  value: string;
}

const DropdownParameter: React.FC<DropdownParameterProps> = ({ nodeId, param, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const updateNodeParameters = useFlowStore(state => state.updateNodeParameters);

  // Use consistent parameter name property (matching the NodeDefinition interface)
  const paramName = param.name || param.id;
  const displayName = param.displayName || param.label || paramName;
  
  // Ensure we have options and a valid current value
  const options = param.options || [];
  const currentValue = value !== undefined && value !== null
    ? value
    : param.defaultValue !== undefined 
      ? param.defaultValue 
      : options.length > 0 ? options[0] : '';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: string) => {
    updateNodeParameters(nodeId, { [paramName]: option });
    setIsOpen(false);
  };

  return (
    <div className="parameter" ref={dropdownRef}>
      <div 
        className="parameter-container dropdown" 
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        <span className="parameter-label">{displayName}</span>
        <span className="parameter-value">{currentValue}</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdown-option ${option === currentValue ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownParameter;
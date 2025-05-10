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
    updateNodeParameters(nodeId, { [param.id]: option });
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
        <span className="parameter-label">{param.label}</span>
        <span className="parameter-value">{value}</span>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          {param.options?.map((option) => (
            <div
              key={option}
              className={`dropdown-option ${option === value ? 'selected' : ''}`}
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
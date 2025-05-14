/**
 * A flexible React component for rendering nodes that are
 * defined at runtime through code. Uses BaseNode for core
 * functionality but adapts to the specific definition.
 */
import React from 'react';
import { NodeProps } from 'reactflow';
import { NodeData } from '../../../types/node-types';
import BaseNode from '../common/base-node/BaseNode';

interface DynamicNodeData extends NodeData {
  isDynamic: true;
  originalDefinition?: Record<string, any>;
  onParameterChange?: (nodeId: string, paramName: string, value: any) => void;
}

const DynamicNode: React.FC<NodeProps<DynamicNodeData>> = (props) => {
  // Add dynamic-specific event handlers or state if needed
  const handleParameterChange = (paramName: string, value: any) => {
    // Handle parameter changes for dynamic nodes
    if (props.data.onParameterChange) {
      props.data.onParameterChange(props.id, paramName, value);
    }
  };

  // Merge props with dynamic-specific handlers
  const enhancedProps: NodeProps<NodeData> = {
    ...props,
    data: {
      ...props.data,
      onParameterChange: handleParameterChange
    }
  };

  return <BaseNode {...enhancedProps} />;
};

export default DynamicNode; 
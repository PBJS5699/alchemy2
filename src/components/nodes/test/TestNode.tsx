import React from 'react';
import { NodeProps } from 'reactflow';
import { NodeData } from '../../../types/node-types';
import BaseNode from '../common/base-node/BaseNode';

const TestNode: React.FC<NodeProps<NodeData>> = (props) => {
  // We're just using the base node here since it handles everything
  return <BaseNode {...props} />;
};

export default TestNode;
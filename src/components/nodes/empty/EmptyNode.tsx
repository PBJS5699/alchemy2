import React from 'react';
import { NodeProps } from 'reactflow';
import { NodeData } from '../../../types/node-types';

const EmptyNode: React.FC<NodeProps<NodeData>> = ({ data }) => {
  return (
    <div className="p-4 border border-gray-300 rounded bg-white shadow-md">
      <div className="font-bold text-center">
        {data.label}
      </div>
    </div>
  );
};

export default EmptyNode; 
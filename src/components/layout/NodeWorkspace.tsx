import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '../../store/flowStore';
import { nodeRegistry } from '../../core/node-system/node-registry';

const NodeWorkspace: React.FC = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useFlowStore();
  
  // Create a map of node types to their components
  const nodeTypes: NodeTypes = {};
  nodeRegistry.getAllDefinitions().forEach(def => {
    const component = nodeRegistry.getComponent(def.type);
    if (component) {
      nodeTypes[def.type] = component;
    }
  });
  
  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default NodeWorkspace;
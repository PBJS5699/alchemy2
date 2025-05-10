import React from 'react';
import NodeWorkspace from './NodeWorkspace';
import CodeEditor from './CodeEditor';
import { ReactFlowProvider } from 'reactflow';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-none h-12 bg-gray-800 text-white px-4 flex items-center">
        <h1 className="text-xl font-bold">Alchemy2</h1>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <ReactFlowProvider>
          <div className="w-1/2 h-full border-r border-gray-300">
            <NodeWorkspace />
          </div>
          
          <div className="w-1/2 h-full">
            <CodeEditor height="100%" />
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default MainLayout;
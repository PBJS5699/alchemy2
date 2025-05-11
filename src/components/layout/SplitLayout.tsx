import React, { useEffect } from 'react';
import Split from 'react-split';
import Editor from '@monaco-editor/react';
import ReactFlow, { 
  Background, 
  Controls,
  NodeTypes,
  EdgeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import SectionCollapseButton from '../common/buttons/SectionCollapseButton';
import { useFlowStore } from '../../store/flowStore';
import { useCodeStore } from '../../store/codeStore';
import { nodeRegistry } from '../../core/node-system/node-registry';

const SplitLayout: React.FC = () => {
  // Use flow store instead of local state
  const { 
    nodes, 
    edges, 
    onNodesChange, 
    onEdgesChange, 
    onConnect 
  } = useFlowStore();
  
  // Use code store
  const { code, updateCode, syncCodeToFlow } = useCodeStore();
  
  const [collapsed, setCollapsed] = React.useState(false);
  
  // Create nodeTypes from registry
  const [nodeTypes, setNodeTypes] = React.useState<NodeTypes>({});
  
  // Set up node types from registry
  useEffect(() => {
    const types: NodeTypes = {};
    nodeRegistry.getAllDefinitions().forEach(def => {
      const component = nodeRegistry.getComponent(def.type);
      if (component) {
        types[def.type] = component;
      }
    });
    console.log("Registered node types:", Object.keys(types));
    setNodeTypes(types);
  }, []);
  
  // Log current nodes for debugging
  useEffect(() => {
    console.log("Current nodes in flow:", nodes);
  }, [nodes]);

  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      background: '#fff',
    }}>
      {collapsed ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div style={{ height: '100%', width: '100%', background: '#ffffff', overflow: 'hidden' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              style={{ width: '100%', height: '100%' }}
            >
              <Background />
              <Controls />
            </ReactFlow>
          </div>
          <SectionCollapseButton
            onClick={() => setCollapsed(false)}
            collapsed={true}
            className="button collapsed"
          >
            Code
          </SectionCollapseButton>
        </div>
      ) : (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Split
            sizes={[50, 50]}
            minSize={[200, 200]}
            gutterSize={8}
            gutterStyle={() => ({
              backgroundColor: '#eee',
              cursor: 'col-resize',
              position: 'relative',
            })}
            style={{ 
              display: 'flex', 
              flexDirection: 'row',
              height: '100%',
              width: '100%'
            }}
          >
            {/* Node workspace on the left */}
            <div style={{ 
              height: '100%', 
              width: '100%', 
              background: '#ffffff',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                style={{ width: '100%', height: '100%' }}
              >
                <Background />
                <Controls />
              </ReactFlow>
            </div>
            {/* Code editor on the right */}
            <div style={{ 
              height: '100%', 
              width: '100%', 
              background: '#1e1e1e',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}>
              <div className="absolute top-0 right-0 z-10 m-2">
                <button 
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={syncCodeToFlow}
                >
                  Sync to Nodes
                </button>
              </div>
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => value !== undefined && updateCode(value)}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </Split>
          {/* Toggle button floats at the gutter */}
          <SectionCollapseButton
            onClick={() => setCollapsed(true)}
            collapsed={false}
            className="button expanded"
          >
            Code
          </SectionCollapseButton>
        </div>
      )}
    </div>
  );
};

export default SplitLayout;
import React from 'react';
import Split from 'react-split';
import Editor from '@monaco-editor/react';
import ReactFlow, { 
  Background, 
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  NodeTypes,
  EdgeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import SectionCollapseButton from '../common/buttons/SectionCollapseButton';

// Define node types outside of component to prevent recreation
const nodeTypes: NodeTypes = {};
const edgeTypes: EdgeTypes = {};

const SplitLayout: React.FC = () => {
  const [nodes, setNodes] = React.useState<Node[]>([]);
  const [edges, setEdges] = React.useState<Edge[]>([]);
  const [collapsed, setCollapsed] = React.useState(false);

  const onNodesChange = React.useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = React.useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

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
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
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
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
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
              <Editor
                height="100%"
                width="100%"
                defaultLanguage="javascript"
                defaultValue="// Start coding here..."
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
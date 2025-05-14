/**
 * Displays a node when something goes wrong. In the dynamic system,
 * this shows nodes with parsing errors, temporarily displays nodes
 * while dynamic components load, and handles cases where component
 * generation fails.
 */
import React from 'react';
import { NodeProps } from 'reactflow';
import { NodeData } from '../../../types/node-types';
import BaseNode from './base-node/BaseNode';

interface FallbackNodeData extends NodeData {
  error?: {
    message: string;
    details?: string;
  };
  isLoading?: boolean;
  originalType?: string;
}

const FallbackNode: React.FC<NodeProps<FallbackNodeData>> = (props) => {
  const { data } = props;
  const { error, isLoading, originalType } = data;

  // Loading state
  if (isLoading) {
    return (
      <BaseNode {...props} data={{
        ...data,
        label: `Loading ${originalType || 'node'}...`,
        parameters: {},
        className: 'loading-node'
      }}>
        <div className="node-content loading">
          <div className="loading-spinner" />
          <p>Loading node component...</p>
        </div>
      </BaseNode>
    );
  }

  // Error state
  if (error) {
    return (
      <BaseNode {...props} data={{
        ...data,
        label: `Error: ${originalType || 'Unknown Node'}`,
        parameters: {},
        className: 'error-node'
      }}>
        <div className="node-content error">
          <div className="error-icon">⚠️</div>
          <div className="error-message">
            <p>{error.message}</p>
            {error.details && (
              <details>
                <summary>Error Details</summary>
                <pre>{error.details}</pre>
              </details>
            )}
          </div>
        </div>
      </BaseNode>
    );
  }

  // Default fallback state
  return (
    <BaseNode {...props} data={{
      ...data,
      label: originalType ? `Invalid Node: ${originalType}` : 'Unknown Node',
      parameters: {},
      className: 'fallback-node'
    }}>
      <div className="node-content fallback">
        <p>This node could not be rendered properly.</p>
        {originalType && (
          <p className="node-type">Type: {originalType}</p>
        )}
      </div>
    </BaseNode>
  );
};

export default FallbackNode;

// CSS styles for the FallbackNode
const styles = `
.fallback-node {
  opacity: 0.8;
  border: 2px dashed #999;
}

.loading-node {
  opacity: 0.9;
  border: 2px solid #666;
}

.error-node {
  opacity: 1;
  border: 2px solid #ff4444;
}

.node-content {
  padding: 10px;
  text-align: center;
}

.node-content.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.node-content.error {
  color: #ff4444;
}

.error-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.error-message {
  font-size: 12px;
}

.error-message details {
  margin-top: 8px;
  text-align: left;
}

.error-message pre {
  margin-top: 4px;
  padding: 4px;
  background: rgba(255, 0, 0, 0.1);
  border-radius: 4px;
  font-size: 11px;
  overflow-x: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 
import { NodeDefinition, NodeRegistryEntry } from '../../types/node-types';
import { testNodeDefinition } from '../../components/nodes/test/node-definition';
import TestNode from '../../components/nodes/test/TestNode';
import { emptyNodeDefinition } from '../../components/nodes/empty/node-definition';
import EmptyNode from '../../components/nodes/empty/EmptyNode';
import DynamicNode from '../../components/nodes/dynamic/DynamicNode';

class NodeRegistry {
  private registry: Map<string, NodeRegistryEntry> = new Map();
  private dynamicNodeTypes: Set<string> = new Set();
  
  constructor() {
    // Register test node
    this.register(testNodeDefinition, TestNode);
    
    // Register empty node
    this.register(emptyNodeDefinition, EmptyNode);
  }
  
  register(definition: NodeDefinition, component: React.ComponentType<any>) {
    this.registry.set(definition.type, {
      definition,
      component
    });
  }
  
  getDefinition(type: string): NodeDefinition | undefined {
    return this.registry.get(type)?.definition;
  }
  
  getComponent(type: string): React.ComponentType<any> | undefined {
    return this.registry.get(type)?.component;
  }
  
  getAllDefinitions(): NodeDefinition[] {
    return Array.from(this.registry.values()).map(entry => entry.definition);
  }
  
  getNodesByCategory(category: string): NodeDefinition[] {
    return this.getAllDefinitions().filter(def => def.category === category);
  }

  hasNodeType(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * Register a dynamically defined node type
   */
  registerDynamicNode(definition: NodeDefinition, component?: React.ComponentType<any>) {
    // Add to dynamic nodes set for tracking
    this.dynamicNodeTypes.add(definition.type);
    
    // Register with default dynamic component if none provided
    this.register(
      {
        ...definition,
        category: 'dynamic',
        description: definition.description || `Dynamically defined ${definition.type} node`,
        icon: definition.icon || 'dynamic'
      },
      component || this.createDynamicNodeComponent(definition)
    );
  }
  
  /**
   * Clear all dynamically registered nodes
   */
  clearDynamicNodes() {
    // Remove all dynamic nodes from registry
    this.dynamicNodeTypes.forEach(type => {
      this.registry.delete(type);
    });
    this.dynamicNodeTypes.clear();
  }
  
  /**
   * Create a component for a dynamic node definition
   */
  private createDynamicNodeComponent(definition: NodeDefinition): React.ComponentType<any> {
    // Return the generic dynamic node component
    // It will receive the node definition as a prop and render accordingly
    return DynamicNode;
  }

  /**
   * Check if a node type is dynamic
   */
  isDynamicNode(type: string): boolean {
    return this.dynamicNodeTypes.has(type);
  }

  /**
   * Get all dynamic node definitions
   */
  getDynamicDefinitions(): NodeDefinition[] {
    return Array.from(this.dynamicNodeTypes)
      .map(type => this.getDefinition(type))
      .filter((def): def is NodeDefinition => def !== undefined);
  }
}

// Export singleton instance
export const nodeRegistry = new NodeRegistry();
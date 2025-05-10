import { NodeDefinition, NodeRegistryEntry } from '../../types/node-types';
import { testNodeDefinition } from '../../components/nodes/test/node-definition';
import TestNode from '../../components/nodes/test/TestNode';

class NodeRegistry {
  private registry: Map<string, NodeRegistryEntry> = new Map();
  
  constructor() {
    // Register test node
    this.register(testNodeDefinition, TestNode);
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
}

// Export singleton instance
export const nodeRegistry = new NodeRegistry();
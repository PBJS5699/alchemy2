import { create } from 'zustand';
import { parseCode } from '../core/code-generation/parser';
import { useFlowStore } from './flowStore';

interface CodeState {
  code: string;
  isValidCode: boolean;
  errorMessage: string | null;
  updateCode: (newCode: string) => void;
  syncCodeToFlow: () => void;
}

export const useCodeStore = create<CodeState>((set, get) => ({
  code: '// Define your image processing workflow here\n',
  isValidCode: true,
  errorMessage: null,
  
  updateCode: (newCode) => {
    set({ code: newCode });
    
    // We'll implement auto-sync feature later
    // For now, we'll just validate the code
    try {
      // This function will be implemented in a later step
      parseCode(newCode);
      set({ isValidCode: true, errorMessage: null });
    } catch (error) {
      set({ 
        isValidCode: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  },
  
  syncCodeToFlow: () => {
    try {
      const code = get().code;
      // This will be implemented in later steps
      const { nodes, edges } = parseCode(code);
      
      // Update the flow store with the new nodes and edges
      const flowStore = useFlowStore.getState();
      // This is simplified for now, we'll implement it properly later
      // flowStore.setNodes(nodes);
      // flowStore.setEdges(edges);
      
      set({ isValidCode: true, errorMessage: null });
    } catch (error) {
      set({ 
        isValidCode: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}));
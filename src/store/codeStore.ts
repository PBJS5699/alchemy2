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
      console.log("Starting sync to flow");
      const code = get().code;
      console.log("Code to parse:", code);
      
      const result = parseCode(code);
      console.log("Parse result:", result);
      
      const { nodes, edges } = result;
      console.log("Nodes:", nodes);
      console.log("Edges:", edges);
      
      // Update the flow store with the new nodes and edges
      const flowStore = useFlowStore.getState();
      flowStore.setNodes(nodes);
      flowStore.setEdges(edges);
      
      console.log("Sync complete");
      set({ isValidCode: true, errorMessage: null });
    } catch (error) {
      console.error("Error in syncCodeToFlow:", error);
      set({ 
        isValidCode: false, 
        errorMessage: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}));
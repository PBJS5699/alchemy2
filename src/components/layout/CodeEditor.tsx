import React, { useEffect, useRef } from 'react';
import Editor, { OnChange, OnMount } from '@monaco-editor/react';
import { useCodeStore } from '../../store/codeStore';

interface CodeEditorProps {
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ height = '100%' }) => {
  const { code, updateCode, isValidCode, errorMessage, syncCodeToFlow } = useCodeStore();
  const editorRef = useRef<any>(null);
  
  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Set up language features (this would be expanded in later steps)
    monaco.languages.register({ id: 'alchemy-dsl' });
    monaco.languages.setMonarchTokensProvider('alchemy-dsl', {
      tokenizer: {
        root: [
          [/\/\/.*$/, 'comment'],
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@default': 'identifier'
            }
          }],
          [/".*?"/, 'string'],
          [/'.*?'/, 'string'],
          [/[0-9]+(\.[0-9]+)?/, 'number'],
          [/[=+\-*/<>!&|^~%]+/, 'operator'],
        ]
      }
    });
    
    // Set editor language
    const model = editor.getModel();
    if (model) {
      monaco.editor.setModelLanguage(model, 'alchemy-dsl');
    }
  };
  
  const handleEditorChange: OnChange = (value) => {
    if (value !== undefined) {
      updateCode(value);
    }
  };
  
  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 right-0 z-10 m-2">
        <button 
          className="px-2 py-1 bg-blue-500 text-white rounded"
          onClick={syncCodeToFlow}
        >
          Sync to Nodes
        </button>
      </div>
      
      <Editor
        height={height}
        defaultLanguage="javascript"
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          fontSize: 14,
        }}
      />
      
      {!isValidCode && errorMessage && (
        <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-800 p-2 border-t border-red-300">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default CodeEditor;
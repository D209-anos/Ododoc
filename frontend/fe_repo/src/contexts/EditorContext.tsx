import React, { createContext, useContext, useState, useCallback } from 'react';
import { saveFile } from '../api/service/editor'; // 경로는 실제 파일 위치에 맞게 수정

interface EditorContextProps {
    editorData: { [key: number]: any };
    currentDirectoryId: number | null;
    setCurrentId: (directoryId: number) => void;
    updateEditorData: (directoryId: number, data: any) => void;
    saveToServer: (directoryId: number) => Promise<void>;
  }
  
  const EditorContext = createContext<EditorContextProps>({
    editorData: {},
    currentDirectoryId: null,
    setCurrentId: () => {},
    updateEditorData: () => {},
    saveToServer: async () => {},
  });

  interface EditorProviderProps {
    children: React.ReactNode;
  }
  
  export const EditorProvider: React.FC<EditorProviderProps> = ({ children } : any) => {
    const [editorData, setEditorData] = useState<{ [key: number]: any }>({});
    const [currentDirectoryId, setCurrentDirectoryId] = useState<number | null>(null);
  
    const saveToServer = useCallback(async (id : any) => {
        if (id && editorData[id]) {
          try {
            await saveFile(id, editorData[id]);
          } catch (error) {
            console.error('서버 저장 실패', error);
          }
        }
      }, [editorData]);
  
      const updateEditorData = useCallback((id : any, data : any) => {
        setEditorData((prevData) => ({
          ...prevData,
          [id]: data,
        }));
      }, []);

      const setCurrentId = useCallback((id : any) => {
        setCurrentDirectoryId(id);
      }, []);
  
    return (
      <EditorContext.Provider
        value={{ editorData, currentDirectoryId, setCurrentId, updateEditorData, saveToServer }}
      >
        {children}
      </EditorContext.Provider>
    );
  };
  
  export const useEditorContext = () => useContext(EditorContext);
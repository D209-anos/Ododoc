import React, { useState, useEffect } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css';
import FolderImage from '../../../assets/images/icon/forder.png'
import AddButton from '../../../assets/images/mark/addbutton.png'
import FileAddModal from '../sidebar/modal/FileAddModal'
import NameEditor from './NameEditor';
import { createDirectory } from '../../../api/service/directory';
import { useFileContext } from '../../../contexts/FileContext';

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: string | IContentItem[];
}

interface FolderItemProps {
    item: IContentItem;
    parentId: number | null;
    toggleModal: (id: number) => void;
    folderAddModal: Record<number, boolean>;
    renderContents: (contents: IContentItem[] | undefined) => JSX.Element[];
    handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
    handleItemClick: (id: number) => void;
    selectedItem: IContentItem | null;
    isContentEditing: boolean;
    setIsContentEditing: (editing: boolean) => void;
    saveName: (objectId: number, name: string) => void;
    setCreateFolderParentId: (id: number | null) => void;
    setAddingFolderId: (id: number | null) => void;
    addingFolderId: number | null;
    saveNewFolder: (objectId: number, newName: string) => void;
    setAddingFileId: (id: number | null) => void;
    addingFileId: number | null;
    saveNewFile: (objectId: number, newName: string) => void;
    isAddingSubFile: boolean;
    setIsAddingSubFile: (isAdding: boolean) => void;
}

const FolderItem: React.FC<FolderItemProps> = ({ 
    item, 
    parentId, 
    toggleModal, 
    folderAddModal,
    renderContents, 
    handleContextMenu,
    handleItemClick,
    selectedItem,
    isContentEditing, 
    setIsContentEditing, 
    saveName, 
    setCreateFolderParentId,
    setAddingFolderId,
    addingFolderId,
    saveNewFolder,
    setAddingFileId,
    addingFileId,
    saveNewFile,
    isAddingSubFile,
    setIsAddingSubFile,
 }) => {
    const [isFolderOpen, setIsFolderOpen] = useState(false);            // add-button 여닫는 여부
    const [isDragOver, setIsDragOver] = useState(false);                // 드래그
    const [isAddingSubFolder, setIsAddingSubFolder] = useState(false);  // 폴더 추가 상태
    const [newFolderName, setNewFolderName] = useState('');             // 폴더 이름 상태
    // const [isAddingSubFile, setIsAddingSubFile] = useState(false);      // 파일 추가 상태
    // const [newFileName, setNewFileName] = useState('');                 // 파일 이름 상태
    


    useEffect(() => {
        console.log("addingFileId:", addingFolderId);
        console.log("isAddingSubFile:", isAddingSubFolder);
    }, [addingFolderId, isAddingSubFolder]);

    // 폴더 하위 요소 여닫는 함수
    const toggleFolder = () => {
        setIsFolderOpen(!isFolderOpen);
        handleItemClick(item.id)
    }

    // 폴더명 수정 함수
    const renderContentNameField = (): JSX.Element | null => {
        if (isContentEditing && selectedItem && selectedItem.id === item.id) {

            return (
                <div>
                    <NameEditor 
                        objectId={selectedItem.id}
                        name={selectedItem.name}
                        setName={(newName) => {
                            selectedItem.name = newName;
                        }}
                        saveName={saveName}
                        createDirectory={createDirectory}
                        type='FOLDER'
                    />
                </div>
            )
        }
        return null;
    }

    // 부모 ID를 찾는 함수
    const findParentId = (
        contents: IContentItem[] | undefined, 
        id: number, 
        parentId: number | null = null
    ): number | null | undefined => {
        if (!contents || typeof contents === 'string') return undefined;

        for (let item of contents) {
            if (item.id === id) {
                return parentId;
            }
            if (item.type === 'FOLDER' && Array.isArray(item.contents)) {
                const foundParentId = findParentId(item.contents as IContentItem[], id, item.id);   // 재귀로 부모 찾기
                if (foundParentId !== undefined) return foundParentId;
            }
        }
        return undefined;
    }

    // 드래그 시작하는 함수
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData(
            "application/reactflow", 
            JSON.stringify({ id: item.id, parentId: parentId })
        );
        e.dataTransfer.effectAllowed = "move";
        console.log("드래그 시작했다 ~~~")
        console.log(item.id, parentId)
    }

    // 드래그 하고 있는 함수
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
        e.dataTransfer.dropEffect = 'move';
        console.log("드래그 하고 있다!!!")
    }

    const handleDragLeave = () => {
        setIsDragOver(false);
    }

    // 드래그 후 항목 내려놓을 때 함수
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);

        // 폴더의 ID
        const draggedData: { id: number; parentId: number | null } = JSON.parse(
            e.dataTransfer.getData("application/reactflow")
        );

        // 드랍된 곳의 부모 폴더 ID
        if (Array.isArray(item.contents)) {
            const currentParentId = findParentId(item.contents as IContentItem[], draggedData.id);
            console.log("내려놨다 ~~~~", draggedData, currentParentId)
        }
    }

    return (
        <div 
            key={item.id} 
            className={Sidebar.folderSpace}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onContextMenu={(e) => handleContextMenu(e, item.id)}
        >
            <div className={Sidebar.folderWrapper} onClick={toggleFolder}>
                <img src={FolderImage} alt="folder-image" className={Sidebar.forderImage} />
                {isContentEditing && selectedItem && selectedItem.id === item.id ? (
                    renderContentNameField()
                ) : (
                    <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>
                        {item.name}
                    </div>
                )}
                <div>
                    <img 
                        src={AddButton} 
                        alt="add-button" 
                        className={Sidebar.addButton} 
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleModal(item.id);
                        }} 
                    />
                    {folderAddModal[item.id] && (
                        <FileAddModal 
                            isOpen={folderAddModal[item.id]} 
                            onClose={() => toggleModal(item.id)}
                            onAddFolder={() => {
                                setAddingFolderId(item.id);
                                setIsAddingSubFolder(true);
                            }}
                            onAddFile={() => {
                                setAddingFileId(item.id);
                                setIsAddingSubFile(true);
                            }}
                        >
                            <h2>Modal Title</h2>
                            <p>This is modal content!</p>
                        </FileAddModal>
                    )}
                </div>
            </div>
            {addingFolderId === item.id && isAddingSubFolder && (
                <div>
                    <NameEditor 
                        objectId={item.id}
                        name=''
                        setName={setNewFolderName}
                        saveName={(objectId, name) => {
                            saveNewFolder(objectId, name);      // 새로운 폴더 생성 함수 호출
                            setAddingFolderId(null);            // 폴더 추가 완료 후 상태 초기화
                            setIsAddingSubFolder(false);
                        }}
                        createDirectory={createDirectory}
                        type='FOLDER'
                    />
                </div>
            )}
            {/* {addingFileId === item.id && isAddingSubFile && (
                <div>
                    <NameEditor 
                        objectId={item.id}
                        name=''
                        setName={setNewFileName}
                        saveName={(objectId, name) => {
                            saveNewFile(objectId, name);
                            setAddingFileId(null);
                            setIsAddingSubFile(false);
                        }}
                        createDirectory={createDirectory}
                        type='FILE'
                    />
                </div>
            )} */}
        </div>
    );
};

export default FolderItem
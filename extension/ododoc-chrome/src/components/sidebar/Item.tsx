import React, { useState, useEffect, useRef } from 'react';
import '../../css/directory/directory.css';
import FolderImage from '../../images/icon/forder.png';
import FileImage from '../../images/icon/file.png';
import { useFileContext } from '../../contexts/FileContext';


interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: string | IContentItem[];
}

interface ItemProps {
    item: IContentItem;
    parentId: number | null;
    // toggleModal: (id: number) => void;
    // folderAddModal: Record<number, boolean>;
    renderContents: (contents: IContentItem[] | undefined) => JSX.Element[];
    // handleContextMenu: (event: React.MouseEvent<HTMLDivElement>, id: number) => void;
    handleItemClick: (id: number, name: string) => void;
    selectedItem: IContentItem | null;
    // isContentEditing: boolean;
    // setIsContentEditing: (editing: boolean) => void;
    // saveName: (objectId: number, name: string) => void;
    // setCreateFolderParentId: (id: number | null) => void;
    // setAddingFolderId: (id: number | null) => void;
    // addingFolderId: number | null;
    // saveNewFolder: (objectId: number, newName: string) => void;
    // saveNewFile: (objectId: number, newName: string) => void;
    isFolderOpen: boolean;
    toggleFolder: () => void;
    // moveItem: (draggedId: number, targetId: number | null, parentId: number | null) => void;
    // onDragOver?: () => void;
    // onDragLeave?: () => void;
    // dragOver?: boolean;
}

const Item: React.FC<ItemProps> = ({ 
    item, 
    parentId, 
    // toggleModal, 
    // folderAddModal,
    renderContents, 
    // handleContextMenu,
    handleItemClick,
    selectedItem,
    // isContentEditing, 
    // setIsContentEditing, 
    // saveName, 
    // setCreateFolderParentId,
    // setAddingFolderId,
    // addingFolderId,
    // saveNewFolder,
    // saveNewFile,
    isFolderOpen,
    toggleFolder,
    // moveItem,
    // onDragOver,
    // onDragLeave,
    // dragOver
 }) => {
    const [isDragOver, setIsDragOver] = useState(false);                // 드래그
    const [isAddingSubFolder, setIsAddingSubFolder] = useState(false);  // 폴더 추가 상태
    const [newFolderName, setNewFolderName] = useState('');             // 폴더 이름 상태
    const [newFileName, setNewFileName] = useState('');

    const { addingFileId, isAddingSubFile, setAddingFileId, setIsAddingSubFile } = useFileContext();

    const ref = useRef<HTMLDivElement>(null);

    // const [{ isDragging }, drag] = useDrag({
    //     type: 'ITEM',
    //     item: { id: item.id, type: item.type, parentId },
    //     collect: (monitor) => ({
    //         isDragging: monitor.isDragging(),
    //     }),
    // });

    // const [, drop] = useDrop({
    //     accept: 'ITEM',
    //     drop: (draggedItem: { id: number, type: string, parentId: number | null }) => {
    //         moveItem(draggedItem.id, item.id, item.type === 'FOLDER' ? item.id : parentId);
    //         setIsDragOver(false);
    //     },
    //     hover: () => setIsDragOver(true),
    //     collect: (monitor) => ({
    //         isOver: monitor.isOver(),
    //     }),
    // });

    // const [, dropAfter] = useDrop({
    //     accept: 'ITEM',
    //     drop: (draggedItem: { id: number, type: string, parentId: number | null }) => {
    //         moveItem(draggedItem.id, null, null);  // newParentId를 null로 설정하여 최상위로 이동
    //         setIsDragOver(false);
    //     },
    //     hover: () => setIsDragOver(true),
    //     collect: (monitor) => ({
    //         isOver: monitor.isOver(),
    //     }),
    // });


    // drag(drop(ref));

    // const opacity = isDragging ? 0.5 : 1;

    const handleItemClickWrapper = () => {
        handleItemClick(item.id, item.name);
    };

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

    return (
        <div 
            ref={ref}
            key={item.id}
            className={`"folderSpace" ${isDragOver ? "dragOver" : ''}`}
            // onContextMenu={(e) => handleContextMenu(e, item.id)}
            onDragLeave={() => setIsDragOver(false)}
            draggable
        >
            <div className="folderWrapper" onClick={item.type === 'FOLDER' ? toggleFolder : () => handleItemClick(item.id, item.name)}>
                <img src={item.type === 'FOLDER' ? FolderImage : FileImage} alt={`${item.type.toLowerCase()}-image`} className="forderImage" /> 
                <div style={{ fontFamily: 'hanbitFont' }} className="folderName">
                    {item.name}
                </div>
                
                {/* {item.type === 'FOLDER' && (
                    <div>
                        <img 
                            src={AddButton} 
                            alt="add-button" 
                            className="addButton"
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
                )} */}
            </div>
            {/* <div ref={dropAfter} className="dropAfter" /> */}
            {/* {addingFolderId === item.id && isAddingSubFolder && (
                <div>
                    <NameEditor
                        objectId={item.id}
                        name=''
                        setName={setNewFolderName}
                        saveName={(objectId, name) => {
                            saveNewFolder(objectId, name);
                            setAddingFolderId(null);
                            setIsAddingSubFolder(false);
                        }}
                        createDirectory={createDirectory}
                        type='FOLDER'
                    />
                </div>
            )} */}
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

export default Item
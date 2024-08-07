import React, { useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import Sidebar from '../../../css/components/editor/SideBar.module.css'
import PencilImage from '../../../assets/images/icon/pencil.png'
import Line from '../../../assets/images/mark/line.png'
import MakeFileImage from '../../../assets/images/mark/plusbutton.png'
import TrashButton from '../../../assets/images/icon/trashIcon.png'
import SettingButton from '../../../assets/images/icon/settingIcon.png'
import TrashModal from '../../editor/sidebar/modal/TrashModal'
import SettingModal from './modal/SettingModal'
import ContextMenu from './ContextMenu';
import useHandleClickOutside from '../../../hooks/useHandleClickOutside';
import useContextMenu from '../../../hooks/useContextMenu';
import Item from './Item';
import NameEditor from './NameEditor';
import ProfileIcon from '../../../assets/images/icon/profileIcon.png'
import { useNavigate } from 'react-router-dom';
import { fetchDirectory, createDirectory, deleteDirectoryItem, editDirectoryItem, moveDirectoryItem  } from '../../../api/service/directory';
import { useAuth } from '../../../contexts/AuthContext';
import { useFileContext } from '../../../contexts/FileContext';
import { useTrash } from '../../../contexts/TrashContext';
import { useDirectory } from '../../../contexts/DirectoryContext';
import { useEditorContext } from '../../../contexts/EditorContext';

// 디렉토리 타입
interface MyDirectoryItem {
    id: number;
    name: string;
    type: 'FOLDER' | 'FILE';
    children?: MyDirectoryItem[] | string;
}

// 폴더 생성 시 사용되는 interface
interface IContentItemCreate {
    id: number;
    parentId: number | null;
    type: 'FOLDER' | 'FILE';
    name: string;
    children?: MyDirectoryItem[] | string;
}

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const { state, dispatch } = useAuth();
    const { accessToken, rootId, title } = state;
    const { loadTrashbin } = useTrash();

    const [contents, setContents] = useState<MyDirectoryItem[]>([]);                       // 디렉토리 내용 (id, name, type, children)
    const [folderAddModal, setFolderAddModal] = useState<Record<number, boolean>>({});  // 폴더 추가, 파일 추가 모달창 열림 여부 (true / false)
    const [isTrashModalOpen, setTrashModalOpen] = useState<boolean>(false);             // 휴지통 모달창 열림, 닫힘 여부
    const [isSettingModalOpen, setSettingModalOpen] = useState<boolean>(false);         // 설정 모달창 열림, 닫힘 여부
    const [isUsernameEditing, setIsUsernameEditing] = useState<boolean>(false);         // 사용자 이름 수정 여부
    const [userName, setUserName] = useState<string>(title || '');                      // 사용자 이름 수정
    const [isContentEditing, setIsContentEditing] = useState<boolean>(false);           // 폴더명 및 파일명 수정
    const [selectedId, setSelectedId] = useState<number | null>(null);                  // 선택된 파일 또는 폴더의 id
    const [selectedItem, setSelectedItem] = useState<MyDirectoryItem | null>(null);     // 선택된 파일 또는 폴더의 구조
    const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);           // 폴더 생성 여부 (true / false)
    const [newFolderName, setNewFolderName] = useState<string>('');                     // 새로 바꾼 폴더 이름
    const [isCreatingFile, setIsCreatingFile] = useState<boolean>(false);               // 파일 생성 여부 (true / false)
    const [newFileName, setNewFileName] = useState<string>('');                         // 새로 바꾼 파일 이름
    const [createFolderParentId, setCreateFolderParentId] = useState<number | null>(null);  // 생성한 폴더 부모 id (부모 id 넘겨줘야하니깐)
    const [createFileParentId, setCreateFileParentId] = useState<number | null>(null);      // 생성한 파일 부모 id
    const [addingFolderId, setAddingFolderId] = useState<number | null>(null);          // 추가한 폴더 ID
    const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});        // 폴더 열림 닫힘 상태
 
    const { menuState, handleContextMenu, hideMenu } = useContextMenu();                // 우클릭 context menu
    const contextMenuRef = useRef<HTMLUListElement>(null);                              
    useHandleClickOutside(contextMenuRef, hideMenu);                                    // contextMenu 밖 클릭 시 닫힘

    const { directoryData, setDirectoryData } = useDirectory();                         // directory data 저장

    const { currentDirectoryId, editorData, saveToServer, setCurrentId } = useEditorContext();


    // 디렉토리 조회 (로그인 시 title 매핑)
    const loadDirectory = async () => {
        if (accessToken && rootId) {
            const data = await fetchDirectory(rootId);
            setDirectoryData(data);
        }
    };

    useEffect(() => {
        loadDirectory();
    }, [accessToken, rootId]);

    // 디렉토리 조회 (디렉토리 생성 후 조회)
    useEffect(() => {
        if (directoryData){
            setContents(directoryData.children as MyDirectoryItem[])    // diretoryData 정보 넣음
            setUserName(directoryData.name);                            // 사용자 이름 넣음
        } else {

        }
    }, [directoryData])

    // 닉넴
    useEffect(() => {
        if (title) {
            setUserName(title);
        }
    }, [title]);

    // 특정 ID의 add-button 모달 여닫는 함수
    const toggleModal = (id: number): void => {
        setFolderAddModal(prev => ({ ...prev, [id]: !prev[id] }));
        setCreateFolderParentId(id);        // add-button 모달을 열 때 폴더의 부모 ID 설정
        setCreateFileParentId(id);
    };

    // file 클릭    
    const fileItemClick = async (id : any) => {
        // 현재 파일 저장
        if (currentDirectoryId && editorData[currentDirectoryId]) {
          await saveToServer(currentDirectoryId);
        }
        // 새로운 파일로 이동
        setSelectedId(id);
        setCurrentId(id);
        navigate(`/editor/${id}`, { state: id });
      };

    // folder 클릭
    const folderItemClick = (id: number): void => {
        setSelectedId(id);
    }

    // 폴더 열기/닫기 상태 관리
    const toggleFolder = (id: number) => {
        setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }))
    }

    // 폴더명 및 파일명 수정
    const saveName = async (id: number, newName: string) => {
        try {
            const data = await editDirectoryItem(id, newName);

            setContents((prevContents) => {
                const updatedContents = [...prevContents];
                const itemToUpdate = findItemById(updatedContents, id);
                if (itemToUpdate) {
                    itemToUpdate.name = newName;
                }
                return updatedContents;
            });

            setIsContentEditing(false);
        } catch (error) {

        }
    };

    // 사용자 이름 저장 함수 (해당 id의 이름 저장)
    const saveUserName = async (objectId: number, newName: string) => {
        try {
            const data = await editDirectoryItem(objectId, newName);
            dispatch({ type: 'SET_AUTH_DETAILS', payload: { ...state, title: newName } })
            setUserName(newName)
        } catch (error) {

        } finally {
            setIsUsernameEditing(false);
        }
    };

    // 사용자 이름 수정 함수
    const renderNameField = (): JSX.Element => {
        if (isUsernameEditing) {
            return (
                <div>
                    {/* 사용자 이름 수정 UI */}
                    <NameEditor 
                        objectId={rootId || 0} 
                        name={userName}
                        setName={setUserName} 
                        saveName={saveUserName}
                        createDirectory={createDirectory}
                        type="FOLDER"
                    />
                </div>
            );
        }
        return (
            <div onClick={() => setIsUsernameEditing(true)} className={Sidebar.nickname}>
                {userName}
                <img src={PencilImage} alt="pencil-image" className={Sidebar.pencil}/>
            </div>
        );
    };

    // 폴더 및 파일 하위 구조
    const renderContents = (
        children: MyDirectoryItem[] | undefined,
        parentId: number | null,
        indentLevel: number = 0
    ): JSX.Element[] => {
        if (!children) return [];

        return children
            .map((item: MyDirectoryItem) => {
                const isSelected = selectedId === item.id; // 선택된 아이템인지 확인
                const className = `${Sidebar.item} ${indentLevel > 0 ? Sidebar.itemIndent : ''} ${isSelected ? Sidebar.selectedItem : ''}`;
                return (
                    <div key={item.id} className={className}>
                        <Item
                            item={item}
                            parentId={parentId}
                            toggleModal={toggleModal}
                            folderAddModal={folderAddModal}
                            renderContents={(contents) => renderContents(contents, item.id, indentLevel + 1)}
                            handleContextMenu={handleContextMenu}
                            handleItemClick={item.type === 'FOLDER' ? folderItemClick : fileItemClick}
                            selectedItem={selectedItem}
                            isContentEditing={isContentEditing}
                            setIsContentEditing={setIsContentEditing}
                            saveName={saveName}
                            setCreateFolderParentId={setCreateFolderParentId}
                            saveNewFolder={saveNewFolder}
                            setAddingFolderId={setAddingFolderId}
                            addingFolderId={addingFolderId}
                            saveNewFile={saveNewFile}
                            isFolderOpen={openFolders[item.id] || false}    // 폴더 열림 상태 전달
                            toggleFolder={() => toggleFolder(item.id)}  // 폴더 열고 닫기 함수 전달
                            moveItem={moveItem}
                        />
                        {item.type === 'FOLDER' && openFolders[item.id] && item.children && Array.isArray(item.children) && renderContents(item.children, item.id, indentLevel + 1)}
                    </div>
                );
            })
            .filter(Boolean) as JSX.Element[];
    };

    // 선택된 항목 ID 찾기 함수
    const findItemById = (children: MyDirectoryItem[] | string | undefined, id: number): MyDirectoryItem | undefined => {
        if (!children || typeof children === 'string') return undefined;

        for (let item of children) {
            if (item.id === id) {
                return item;
            }
            if (item.type === 'FOLDER' && Array.isArray(item.children)) {
                const found = findItemById(item.children, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    // 우클릭 한 해당 항목의 정보를 setSelectedItem에 상태관리하는 함수
    const handleEdit = (id: number) => {
        const itemToEdit = findItemById(contents, id);
        if (itemToEdit) {
            setSelectedItem(itemToEdit);
            setIsContentEditing(true);
            hideMenu();
        } else {

        }
    }

    // 폴더 또는 파일 삭제 버튼
    const handleDelete = async (id: number) => {
        try {
            const data = await deleteDirectoryItem('trashbin', id)

            // 삭제로 디렉토리 목록 갱신
            const updatedContents = removeItemFromDirectory(contents, id);
            setContents(updatedContents)

            const updatedDirectoryData = await fetchDirectory(rootId);
            setDirectoryData(updatedDirectoryData);

            loadTrashbin();
        } catch (error) {

        }

        hideMenu();
    }

    // directory에서 아이템 제거
    const removeItemFromDirectory = (directory: MyDirectoryItem[], id: number): MyDirectoryItem[] => {
        return directory.reduce((acc: MyDirectoryItem[], item: MyDirectoryItem) => {
            if (item.id === id) {
                return acc;
            }

            if (item.children && Array.isArray(item.children)) {
                const updatedChildren = removeItemFromDirectory(item.children, id);
                if (updatedChildren.length !== item.children.length) {
                    return [...acc, { ...item, children: updatedChildren }];
                }
            }
            return [...acc, item];
        }, []);
    }

    // make-file-button 클릭 시 폴더 생성되는 함수
    const handleCreateFolder = () => {
        setIsCreatingFolder(true);
        setNewFolderName('');  
        setCreateFolderParentId(rootId);        // 최상위 폴더에 생성
    }

    // 새로운 폴더 저장
    const saveNewFolder = async (objectId: number, newName: string) => {
        const newFolder: IContentItemCreate = {
            id: Date.now(),
            parentId: createFolderParentId,
            type: 'FOLDER',
            name: newFolderName,
            children: []
        };

        await createDirectory(objectId, newName, 'FOLDER')

        setContents((prevContents) => {
            const updateContents = [...prevContents];
            const parentIndex = updateContents.findIndex(item => item.id === createFolderParentId);

            if (parentIndex !== -1 && Array.isArray(updateContents[parentIndex].children)) {
                (updateContents[parentIndex].children as MyDirectoryItem[]).push(newFolder);
            } else {
                newFolder.name = newFolderName;
                updateContents.push(newFolder);
            }
            return updateContents;
        })

        // directoryData 갱신
        const updatedDirectoryData = await fetchDirectory(rootId);
        setDirectoryData(updatedDirectoryData);

        setContents(updatedDirectoryData?.children as MyDirectoryItem[])

        setOpenFolders(prev => ({ ...prev, [createFolderParentId!]: true }));

        setIsCreatingFolder(false);
        setNewFolderName('');
        setCreateFolderParentId(null);
    }

    // 새로운 파일 저장
    const saveNewFile = async (objectId: number, newName: string) => {
    try {
        const response = await createDirectory(objectId, newName, 'FILE');
        const newFileId = response.data.id; // 백엔드에서 반환된 파일 ID 사용

        setContents((prevContents) => {
            const updateContents = [...prevContents];
            const parentIndex = updateContents.findIndex(item => item.id === createFileParentId);

            if (parentIndex !== -1 && Array.isArray(updateContents[parentIndex].children)) {
                (updateContents[parentIndex].children as MyDirectoryItem[]).push({
                    id: newFileId,
                    type: 'FILE',
                    name: newName,
                    children: ''
                });
            } else {
                updateContents.push({
                    id: newFileId,
                    type: 'FILE',
                    name: newName,
                    children: ''
                });
            }
            return updateContents;
        });

        const updatedDirectoryData = await fetchDirectory(rootId);
        setDirectoryData(updatedDirectoryData);

        setContents(updatedDirectoryData?.children as MyDirectoryItem[]);

        setOpenFolders(prev => ({ ...prev, [createFileParentId!]: true }));

        setIsCreatingFile(false);
        setNewFileName('');
        setCreateFileParentId(null);

        // 파일 생성 후 해당 경로로 이동
        setSelectedId(newFileId);
        navigate(`/editor/${newFileId}`, { state: newFileId });
    } catch (error) {

    }
};

    // 부모를 찾는 함수
    const findParent = (
        items: MyDirectoryItem[], 
        childId: number
    ): MyDirectoryItem | null => {
        for (let item of items) {
            if (item.type === 'FOLDER' && Array.isArray(item.children)) {
                if (item.children.some(child => child.id === childId)) {
                    return item;
                }
                const foundParent = findParent(item.children as MyDirectoryItem[], childId);
                if (foundParent) {
                    return foundParent;
                }
            }
        }
        return null;
    };

    // 폴더 및 파일 이동
    const moveItem = async (draggedId: number, targetId: number | null, parentId: number | null) => {
        const findAndRemoveItem = (items: MyDirectoryItem[], id: number): { item: MyDirectoryItem | null, items: MyDirectoryItem[] } => {
            let foundItem: MyDirectoryItem | null = null;
            const updatedItems = items.filter(item => {
                if (item.id === id) {
                    foundItem = item;
                    return false;
                }
                if (item.type === 'FOLDER' && Array.isArray(item.children)) {
                    const result = findAndRemoveItem(item.children as MyDirectoryItem[], id);
                    if (result.item) {
                        foundItem = result.item;
                        item.children = result.items;
                    }
                }
                return true;
            });
            return { item: foundItem, items: updatedItems };
        };

        const insertItem = (items: MyDirectoryItem[], newItem: MyDirectoryItem, targetId: number | null, parentId: number | null): MyDirectoryItem[] => {
            if (parentId === null) {
                // 최상위 레벨에 삽입
                if (targetId === null) {
                    items.push(newItem);
                } else {
                    const targetIndex = items.findIndex(item => item.id === targetId);
                    items.splice(targetIndex + 1, 0, newItem);
                }
            } else {
                for (let item of items) {
                    if (item.id === parentId) {
                        if (item.type === 'FOLDER' && Array.isArray(item.children)) {
                            if (targetId === null) {
                                item.children.push(newItem);
                            } else {
                                const targetIndex = item.children.findIndex(child => child.id === targetId);
                                item.children.splice(targetIndex + 1, 0, newItem);
                            }
                        }
                    } else if (item.type === 'FOLDER' && Array.isArray(item.children)) {
                        item.children = insertItem(item.children as MyDirectoryItem[], newItem, targetId, parentId);
                    }
                }
            }
            return items;
        };

        const isValidMove = (draggedItem: MyDirectoryItem, targetId: number | null): boolean => {
            if (draggedItem.id === targetId) return false;

            const findItemById = (items: MyDirectoryItem[], id: number): MyDirectoryItem | undefined => {
                for (let item of items) {
                    if (item.id === id) return item;
                    if (item.type === 'FOLDER' && Array.isArray(item.children)) {
                        const found = findItemById(item.children as MyDirectoryItem[], id);
                        if (found) return found;
                    }
                }
                return undefined;
            };

            const targetItem = findItemById(contents, targetId!);
            if (!targetItem) return true;

            let currentParent: MyDirectoryItem | null = targetItem;
            while (currentParent) {
                if (currentParent.id === draggedItem.id) return false;
                currentParent = findParent(contents, currentParent.id) as MyDirectoryItem | null;
            }

            return true;
        };

        setContents(prevContents => {
            const { item: draggedItem, items: itemsWithoutDragged } = findAndRemoveItem(prevContents, draggedId);
            if (!draggedItem || !isValidMove(draggedItem, targetId)) return prevContents;

            return insertItem(itemsWithoutDragged, draggedItem, targetId, parentId);
        });

        // 디렉토리 이동 API 호출
        try {
            await moveDirectoryItem(draggedId, parentId!);
            const updatedDirectoryData = await fetchDirectory(rootId);
            setDirectoryData(updatedDirectoryData)
        } catch (error) {

        }
    };


    return (
        // 사이드바
        <div className={Sidebar.sidebar}>
            <div>
                <div className={Sidebar.nicknameSpace} style={{ fontFamily: 'hanbitFont' }}>
                    {renderNameField()}
                </div>
                <img src={Line} alt="line" className={Sidebar.line}/>
            </div>
            <div className={Sidebar.folderSpace}>
                {isCreatingFolder && (
                    <div>
                        <NameEditor 
                            objectId={rootId || 0}
                            name={newFolderName}
                            setName={setNewFolderName}
                            saveName={saveNewFolder}
                            createDirectory={createDirectory}
                            type='FOLDER'
                        />
                    </div>
                )}
                {renderContents(contents, null)}
            </div>
            {menuState.visible && (
                <ContextMenu 
                    ref={contextMenuRef} 
                    visible={menuState.visible} 
                    x={menuState.x} 
                    y={menuState.y} 
                    id={menuState.id}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
            <div className={Sidebar.sideButtonWrapper}>
                <img src={ProfileIcon} alt="profile-img" className={Sidebar.profileImage} onClick={() => navigate('/editor/profile')}/>
                <img src={MakeFileImage} alt="make-file-button" className={Sidebar.makeFileButton} onClick={handleCreateFolder}/>
                <img src={TrashButton} alt="trash-button" className={Sidebar.trashButton} onClick={() => setTrashModalOpen(true)}/>
                <TrashModal 
                    isOpen={isTrashModalOpen} 
                    onClose={() => {
                        setTrashModalOpen(false);
                        loadDirectory();
                    }}
                />
                <img src={SettingButton} alt="setting-button" className={Sidebar.settingButton} onClick={() => setSettingModalOpen(true)}/>
                <SettingModal isOpen={isSettingModalOpen} onClose={() => setSettingModalOpen(false)}/>
            </div>
            <div className={Sidebar.handle}/>
        </div>
    )
}

export default SideBar
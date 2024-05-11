import React, { useState, useRef, useEffect } from 'react';
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
import { fetchDirectory, createDirectory, deleteDirectoryItem, editDirectoryItem } from '../../../api/service/directory';
import { useAuth } from '../../../contexts/AuthContext';
import { useFileContext } from '../../../contexts/FileContext';

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
    const [addingFileId, setAddingFileId] = useState<number | null>(null);
    const [isAddingSubFile, setIsAddingSubFile] = useState<boolean>(false);
    const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});        // 폴더 열림 닫힘 상태
    const [sidebarWidth, setSidebarWidth] = useState<number>(250);                      // 초기 사이드바 너비 설정
 
    const { menuState, handleContextMenu, hideMenu } = useContextMenu();                // 우클릭 context menu
    const contextMenuRef = useRef<HTMLUListElement>(null);                              
    useHandleClickOutside(contextMenuRef, hideMenu);                                    // contextMenu 밖 클릭 시 닫힘

    const [ directoryData, setDirectoryData ] = useState<MyDirectoryItem | null>(null);    // directory data 저장

    // 디렉토리 조회 (로그인 시 title 매핑)
    useEffect(() => {
        const loadDirectory = async () => {
            if (accessToken && rootId) {
                const data = await fetchDirectory(rootId);
                setDirectoryData(data)
            }
        };
        
        loadDirectory();
    }, [accessToken, rootId])

    

    // 디렉토리 조회 (디렉토리 생성 후 조회)
    useEffect(() => {
        if (directoryData){
            console.log(directoryData)
            setContents(directoryData.children as MyDirectoryItem[])    // diretoryData 정보 넣음
            setUserName(directoryData.name);                            // 사용자 이름 넣음
        } else {
            console.log("디렉토리 찾을 수 없음.")
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
    const fileItemClick = (id: number): void => {
        navigate(`/editor/${id}`, {state: id})          // 파일 클릭 시 해당 id의 route로 이동
    }

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
            console.log('폴더명/파일명 수정 완료:', data);

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
            console.error('폴더명/파일명 수정 실패:', error);
        }
    };

    // 사용자 이름 저장 함수 (해당 id의 이름 저장)
    const saveUserName = async (objectId: number, newName: string) => {
        try {
            const data = await editDirectoryItem(objectId, newName);
            console.log('닉넴 수정 완료:', data);
            dispatch({ type: 'SET_AUTH_DETAILS', payload: { ...state, title: newName } })
            setUserName(newName)
        } catch (error) {
            console.error('닉넴 수정 에러:', error)
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
                const className = `${Sidebar.item} ${indentLevel > 0 ? Sidebar.itemIndent : ''}`;
                console.log(`폴더: ${item.name} (ID: ${item.id}) - Parent ID: ${parentId}`);
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
        console.log(`${id}`)
        const itemToEdit = findItemById(contents, id);
        if (itemToEdit) {
            setSelectedItem(itemToEdit);
            setIsContentEditing(true);
            hideMenu();
        } else {
            console.error('Item not found.')
        }
    }

    // 폴더 또는 파일 삭제 버튼
    const handleDelete = async (id: number) => {
        try {
            console.log(`delete id: ${id}`)
            const data = await deleteDirectoryItem('trashbin', id)
            console.log('삭제 성공:', data)

            // 삭제로 디렉토리 목록 갱신
            // const updatedContents = contents.filter(item => item.id !== id);
            const updatedContents = removeItemFromDirectory(contents, id);
            setContents(updatedContents)

            const updatedDirectoryData = await fetchDirectory(rootId);
            setDirectoryData(updatedDirectoryData);
        } catch (error) {
            console.log('directory delete error:', error)
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
        const newFile: IContentItemCreate = {
            id: Date.now(),
            parentId: createFileParentId,
            type: 'FILE',
            name: newFileName,
            children: ''
        };

        await createDirectory(objectId, newName, 'FILE')

        setContents((prevContents) => {
            const updateContents = [...prevContents];
            const parentIndex = updateContents.findIndex(item => item.id === createFileParentId);

            if (parentIndex !== -1 && Array.isArray(updateContents[parentIndex].children)) {
                (updateContents[parentIndex].children as MyDirectoryItem[]).push(newFile);
            } else {
                newFile.name = newFileName;
                updateContents.push(newFile);
            }
            return updateContents;
        })

        // directoryData 갱신
        const updatedDirectoryData = await fetchDirectory(rootId);
        setDirectoryData(updatedDirectoryData);

        setContents(updatedDirectoryData?.children as MyDirectoryItem[])

        setOpenFolders(prev => ({ ...prev, [createFileParentId!]: true }));

        setIsCreatingFile(false);
        setNewFileName('');
        setCreateFileParentId(null);
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    const handleMouseMove = (e: MouseEvent) => {
        setSidebarWidth(e.clientX);
    }

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp)
    }

    return (
        // 사이드바
        <div className={Sidebar.sidebar} style={{ width: sidebarWidth }}>
            <div className={Sidebar.nicknameSpace} style={{ fontFamily: 'hanbitFont' }}>
                {renderNameField()}
            </div>
            <img src={Line} alt="line" className={Sidebar.line}/>
            {isCreatingFolder && (
                <div className={Sidebar.folderSpace}>
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
                </div>
            )}
            {renderContents(contents, null)}
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
                <TrashModal isOpen={isTrashModalOpen} onClose={() => setTrashModalOpen(false)} />
                <img src={SettingButton} alt="setting-button" className={Sidebar.settingButton} onClick={() => setSettingModalOpen(true)}/>
                <SettingModal isOpen={isSettingModalOpen} onClose={() => setSettingModalOpen(false)}/>
            </div>
            <div className={Sidebar.handle} onMouseDown={handleMouseDown}/>
        </div>
    )
}

export default SideBar
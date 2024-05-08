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
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import NameEditor from './NameEditor';
import ProfileIcon from '../../../assets/images/icon/profileIcon.png'
import { useNavigate } from 'react-router-dom';
import { fetchDirectory } from '../../../api/service/directory';
import { useAuth } from '../../../contexts/AuthContext';

interface IContentItem {
    id: number;
    parentId?: number | null;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: IContentItem[] | string;
}

// 임시 데이터
const dummyData: IContentItem = {
    "id": 1,
    "type": "FOLDER",
    "name": "현재의 정리 공간",
    "contents": [
        {
            "id": 2,
            "type": "FOLDER",
            "name": "ododoc 프로젝트",
            "contents": [
                {
                    "id": 7,
                    "type": "FOLDER",
                    "name": "프로젝트 이슈 모음집",
                    "contents": [
                        {
                        "id": 13,
                        "type": "FILE",
                        "name": "2024-04-20",
                        "contents": "13번입니다."
                        },
                        {
                        "id": 144,
                        "type": "FILE",
                        "name": "2024-04-22",
                        "contents": "144번입니다."
                        },
                        {
                        "id": 155,
                        "type": "FILE",
                        "name": "2024-04-25",
                        "contents": "155번입니다."
                        },
                        {
                        "id": 166,
                        "type": "FILE",
                        "name": "2024-05-03",
                        "contents": "166번입니다."
                        },
                    ]
                },
            ]
            
        },
        {
            "id": 4,
            "type": "FOLDER",
            "name": "밀정윷놀이 프로젝트",
            "contents": [
                {
                    "id": 45,
                    "type": "FOLDER",
                    "name": "얌얌 프로젝트",
                    "contents": []
                },
                { "id": 999,
                "type": "FILE",
                "name": "Project Description",
                "contents": "안녕 글 내용이야 이렇고 저렇고"
            }
          ]
        },
        {
            "id": 5,
            "type": "FOLDER",
            "name": "vodle 프로젝트",
            "contents": []
        }
    ]
};

const SideBar: React.FC = () => {
    const { state, dispatch } = useAuth();
    const { accessToken, rootId, title } = state;

    const navigate = useNavigate();
    // const [contents, setContents] = useState<IContentItem[]>([]);
    const [modalActive, setModalActive] = useState<Record<number, boolean>>({});        // 파일, 폴더 생성 모달창 열림, 닫힘 여부
    const [isTrashModalOpen, setTrashModalOpen] = useState<boolean>(false);             // 휴지통 모달창 열림, 닫힘 여부
    const [isSettingModalOpen, setSettingModalOpen] = useState<boolean>(false);         // 설정 모달창 열림, 닫힘 여부
    const [isEditing, setIsEditing] = useState<boolean>(false);                         // 사용자 이름 수정 여부
    const [isContentEditing, setIsContentEditing] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(title || '');                  // 사용자 이름 수정
    const [selectedId, setSelectedId] = useState<number | null>(null);                  // 선택된 id
    const [selectedItem, setSelectedItem] = useState<IContentItem | null>(null);

    const { menuState, handleContextMenu, hideMenu } = useContextMenu();
    const contextMenuRef = useRef<HTMLUListElement>(null);
    useHandleClickOutside(contextMenuRef, hideMenu);

    // 디렉토리 조회
    useEffect(() => {
        const loadDirectory = async () => {
            const rootId = state.rootId;
            const accessToken = state.accessToken;
            const directoryData = await fetchDirectory(rootId);

            if (directoryData && accessToken) {
                console.log('데이터 들어왔따 ~~~')
                console.log(directoryData)
                // setContents(directoryData.contents as IContentItem[]);
                setUserName(directoryData.name);
            }
        };
        

        loadDirectory();
    }, [])


    useEffect(() => {
        if (title) {
            setUserName(title);
        }
    })

    const toggleModal = (id: number): void => {
        setModalActive(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // file 클릭
    const fileItemClick = (id: number): void => {
        navigate(`/editor/${id}`, {state: id})
    }

    // folder 클릭
    const folderItemClick = (id: number): void => {
        // setSelectedId(id);
        // console.log(id)
    }

    // 사용자 이름 저장 함수
    const saveUserName = (objectId: number) => {
        setIsEditing(false);
        // 사용자 이름 수정 API 호출 코드 작성
        dispatch({ type: 'SET_AUTH_DETAILS', payload: { ...state, title: userName } })
    };

    // 사용자 이름 수정 함수
    // 항목 클릭
    const handleItemClick = (id: number): void => {
        navigate(`/editor/${id}`)
        setSelectedId(id);
    }
    const renderNameField = (): JSX.Element => {
        if (isEditing) {
            return (
                <div>
                    <NameEditor 
                        objectId={state.rootId || 0} 
                        name={userName} 
                        setName={setUserName} 
                        saveName={saveUserName}
                    />
                </div>
            );
        }
        return (
            <div onClick={() => setIsEditing(true)} className={Sidebar.nickname}>
                {userName}
                <img src={PencilImage} alt="pencil-image" className={Sidebar.pencil} onClick={() => setIsEditing(true)} />
            </div>
        );
    };

    // 부모 ID를 찾는 함수
    const findParentId = (contents: IContentItem[] | undefined, id: number, parentId: number | null = null): number | null | undefined => {
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

    // parentId
    const parentId = (id: number): void => {
        findParentId(dummyData.contents as IContentItem[], id);
        console.log("Select ID:", id)
        console.log("Parent ID:", parentId)
    }

    // 폴더 및 파일 하위 구조
    const renderContents = (contents: IContentItem[] | undefined, parentId: number | null, indentLevel: number = 0): JSX.Element[] => {
        if (!contents) return [];

        return contents.map((item: IContentItem) => {
            const className = `${Sidebar.item} ${indentLevel > 0 ? Sidebar.itemIndent : ''}`; // 하위 요소 들여쓰기
            if (item.type === 'FOLDER') {
                return (
                    <div key={item.id} className={className}>
                        <FolderItem 
                            item={item}
                            parentId={parentId}
                            toggleModal={toggleModal} 
                            modalActive={modalActive} 
                            renderContents={() => renderContents(item.contents as IContentItem[], item.id, indentLevel + 1)} 
                            handleContextMenu={handleContextMenu} 
                            handleItemClick={folderItemClick} 
                            selectedItem={selectedItem} 
                            isContentEditing={isContentEditing} 
                            setIsContentEditing={setIsContentEditing} 
                            saveName={saveName}
                        />
                    </div>
                );
            } else {
                return (
                    <div key={item.id} className={className}>
                        <FileItem 
                            item={item} 
                            parentId={item.id}
                            selected={item.id === selectedId} 
                            handleContextMenu={handleContextMenu} 
                            handleItemClick={fileItemClick} 
                            selectedItem={selectedItem} 
                            isContentEditing={isContentEditing} 
                            setIsContentEditing={setIsContentEditing} 
                            saveName={saveName}/>
                    </div>
                );
            }
        });
    };

    // 선택된 항목 ID 찾기 함수
    const findItemById = (contents: IContentItem[] | string | undefined, id: number): IContentItem | undefined => {
        if (!contents || typeof contents === 'string') return undefined;

        for (let item of contents) {
            if (item.id === id) {
                return item;
            }
            if (item.type === 'FOLDER' && Array.isArray(item.contents)) {
                const found = findItemById(item.contents, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    // 우클릭 한 해당 항목의 정보를 setSelectedItem에 상태관리하는 함수
    const handleEdit = (id: number) => {
        console.log(`${id}`)
        const itemToEdit = findItemById(dummyData.contents, id);
        if (itemToEdit) {
            setSelectedItem(itemToEdit);
            setIsContentEditing(true);
            hideMenu();
        } else {
            console.error('Item not found.')
        }
    }

    // 이름 저장
    const saveName = (newName: string) => {
        if (selectedItem) {
            selectedItem.name = newName;
            setIsContentEditing(false);
        } else {
            console.error('No item selected.')
        }
    }    

    const handleDelete = (id: number) => {
        console.log(`${id}`)
        hideMenu();
    }

    return (
        // 사이드바
        <div className={Sidebar.sidebar}>
            <div className={Sidebar.nicknameSpace} style={{ fontFamily: 'hanbitFont' }}>
                {renderNameField()}
            </div>
            <img src={Line} alt="line" className={Sidebar.line}/>
            {renderContents(dummyData.contents as IContentItem[], null)}
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
                <img src={MakeFileImage} alt="make-file-button" className={Sidebar.makeFileButton}/>
                <img src={TrashButton} alt="trash-button" className={Sidebar.trashButton} onClick={() => setTrashModalOpen(true)}/>
                <TrashModal isOpen={isTrashModalOpen} onClose={() => setTrashModalOpen(false)} />
                <img src={SettingButton} alt="setting-button" className={Sidebar.settingButton} onClick={() => setSettingModalOpen(true)}/>
                <SettingModal isOpen={isSettingModalOpen} onClose={() => setSettingModalOpen(false)}/>
            </div>
        </div>
    )
}

export default SideBar
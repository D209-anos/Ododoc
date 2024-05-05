import React, { useState, useRef } from 'react';
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

interface IContentItem {
    id: number;
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
    const navigate = useNavigate();
    const [modalActive, setModalActive] = useState<Record<number, boolean>>({});        // 파일, 폴더 생성 모달창 열림, 닫힘 여부
    const [isTrashModalOpen, setTrashModalOpen] = useState<boolean>(false);             // 휴지통 모달창 열림, 닫힘 여부
    const [isSettingModalOpen, setSettingModalOpen] = useState<boolean>(false);         // 설정 모달창 열림, 닫힘 여부
    const [isEditing, setIsEditing] = useState<boolean>(false);                         // 사용자 이름 수정 여부
    const [isContentEditing, setIsContentEditing] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>(dummyData.name);                   // 사용자 이름 수정
    const [selectedId, setSelectedId] = useState<number | null>(null);                  // 선택된 id
    const [selectedItem, setSelectedItem] = useState<IContentItem | null>(null);

    const { menuState, handleContextMenu, hideMenu } = useContextMenu();
    const contextMenuRef = useRef<HTMLUListElement>(null);
    useHandleClickOutside(contextMenuRef, hideMenu);

    const toggleModal = (id: number): void => {
        setModalActive(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // file 클릭
    const fileItemClick = (id: number): void => {
        navigate(`/editor/${id}`, {state: id})
        // setSelectedId(id);
        // console.log(id)
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
    };

    // 사용자 이름 수정 함수
    const renderNameField = (): JSX.Element => {
        if (isEditing) {
            return (
                <div>
                    <NameEditor 
                        objectId={dummyData.id} 
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

    // 폴더 및 파일 하위 구조
    const renderContents = (contents: IContentItem[] | undefined, indentLevel: number = 0): JSX.Element[] => {
        if (!contents) return [];

        return contents.map((item: IContentItem) => {
            const className = `${Sidebar.item} ${indentLevel > 0 ? Sidebar.itemIndent : ''}`; // 들여쓰기 클래스 조건적 적용
            if (item.type === 'FOLDER') {
                return (
                    <div key={item.id} className={className}>
                        <FolderItem item={item} toggleModal={toggleModal} modalActive={modalActive} renderContents={() => renderContents(item.contents as IContentItem[], indentLevel + 1)} handleContextMenu={handleContextMenu} handleItemClick={folderItemClick} selectedItem={selectedItem} isContentEditing={isContentEditing} setIsContentEditing={setIsContentEditing} saveName={saveName}/>
                    </div>
                );
            } else {
                return (
                    <div key={item.id} className={className}>
                        <FileItem item={item} selected={item.id === selectedId} handleContextMenu={handleContextMenu} handleItemClick={fileItemClick} selectedItem={selectedItem} isContentEditing={isContentEditing} setIsContentEditing={setIsContentEditing} saveName={saveName}/>
                    </div>
                );
            }
        });
    };

    const findItemById = (contents: IContentItem[] | string | undefined, id: number): IContentItem | undefined => {
        if (!contents || typeof contents === 'string') return undefined; // Early return if contents is undefined or a string

        for (let item of contents) {
            if (item.id === id) {
                return item;
            }
            // Ensure we only recurse into contents if it is an array
            if (item.type === 'FOLDER' && Array.isArray(item.contents)) {
                const found = findItemById(item.contents, id);
                if (found) return found;
            }
        }
        return undefined;
    };

    // 우클릭 한 해당 항목의 정보를 setSelectedItem에 상태관리하는 함수
    const handleEdit = (id: number) => {
        // console.log(`${id}`)
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
            {renderContents(dummyData.contents as IContentItem[])}
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
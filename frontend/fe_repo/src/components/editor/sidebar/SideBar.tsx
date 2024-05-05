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
                        "contents": "13번입니다."
                        },
                        {
                        "id": 155,
                        "type": "FILE",
                        "name": "2024-04-25",
                        "contents": "13번입니다."
                        },
                        {
                        "id": 166,
                        "type": "FILE",
                        "name": "2024-05-03",
                        "contents": "13번입니다."
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
                { "id": 5,
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
    const [isEditing, setIsEditing] = useState<boolean>(false);                         // 수정 여부
    const [folderName, setFolderName] = useState<string>(dummyData.name);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isFolderOpen, setIsFolderOpen] = useState<Record<number, boolean>>({});      // 폴더 열고 닫기

    const { menuState, handleContextMenu, hideMenu } = useContextMenu();
    const contextMenuRef = useRef<HTMLUListElement>(null);
    useHandleClickOutside(contextMenuRef, hideMenu);

    const toggleModal = (id: number): void => {
        setModalActive(prev => ({ ...prev, [id]: !prev[id] }));
    };
    
    const saveName = (objectId: number) => {
        setIsEditing(false);
        // 사용자 이름 수정 API 호출 코드 작성
    };

    // 폴더 열고 닫는 함수
    const toggleFolder = (id: number) => {
        setIsFolderOpen(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    // 항목 클릭
    const handleItemClick = (id: number): void => {
        navigate(`/editor/${id}`, {state: id})
        setSelectedId(id);
        console.log(id)
    }

    // 폴더명 수정 함수
    const renderNameField = (): JSX.Element => {
        if (isEditing) {
            return (
                <div>
                    <NameEditor 
                        objectId={dummyData.id} 
                        name={folderName} 
                        setName={setFolderName} 
                        saveName={saveName}
                    />
                </div>
            );
        }
        return (
            <div onClick={() => setIsEditing(true)} className={Sidebar.nickname}>
                {folderName}
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
                        <FolderItem item={item} toggleModal={toggleModal} modalActive={modalActive} renderContents={() => renderContents(item.contents as IContentItem[], indentLevel + 1)} handleContextMenu={handleContextMenu} />
                    </div>
                );
            } else {
                return (
                    <div key={item.id} className={className}>
                        <FileItem item={item} selected={item.id === selectedId} handleContextMenu={handleContextMenu} handleItemClick={handleItemClick}/>
                    </div>
                );
            }
        });
    };

    return (
        // 사이드바
        <div className={Sidebar.sidebar}>
            <div className={Sidebar.nicknameSpace} style={{ fontFamily: 'hanbitFont' }}>
                {renderNameField()}
            </div>
            <img src={Line} alt="line" className={Sidebar.line}/>
            {renderContents(dummyData.contents as IContentItem[])}
            {menuState.visible && (
                <ContextMenu ref={contextMenuRef} visible={menuState.visible} x={menuState.x} y={menuState.y} />
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
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


interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: string | IContentItem[];
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
            "name": "sub-folder1",
            "contents": [
                {
                    "id": 3,
                    "type": "FILE",
                    "name": "file55",
                    "contents": "글글글글글"
                },
                {
                    "id": 7,
                    "type": "FOLDER",
                    "name": "sub-folder22",
                    "contents": [
                        {
                        "id": 13,
                        "type": "FILE",
                        "name": "file13",
                        "contents": "13번입니다."
                    },
                    {
                        "id": 17,
                        "type": "FOLDER",
                        "name": "file13",
                        "contents": [
                            {
                                "id": 10,
                                "type": "FILE",
                                "name": "file13",
                                "contents": "13번입니다."
                            },
                            {
                                "id": 1445,
                                "type": "FILE",
                                "name": "fileSDFSDFWDFSFSDFSDFSD",
                                "contents": "13번입니다."
                            },
                            {
                                "id": 1348,
                                "type": "FILE",
                                "name": "file13",
                                "contents": "13번입니다."
                            },

                        ]
                    },
                    ]
                },
            ]
        },
        {
            "id": 4,
            "type": "FILE",
            "name": "file11",
            "contents": "안녕 글 내용이야 이렇고 저렇고"
        },
        {
            "id": 5,
            "type": "FILE",
            "name": "file22",
            "contents": "글글글글"
        }
    ]
};

const SideBar: React.FC = () => {
    const [modalActive, setModalActive] = useState<Record<number, boolean>>({});        // 파일, 폴더 생성 모달창 열림, 닫힘 여부
    const [isTrashModalOpen, setTrashModalOpen] = useState<boolean>(false);             // 휴지통 모달창 열림, 닫힘 여부
    const [isSettingModalOpen, setSettingModalOpen] = useState<boolean>(false);         // 설정 모달창 열림, 닫힘 여부
    const [isEditing, setIsEditing] = useState<boolean>(false);                         // 수정 여부
    const [folderName, setFolderName] = useState<string>(dummyData.name);

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
    const renderContents = (contents: IContentItem[] | undefined): JSX.Element[] => {
        if (!contents) return [];

        return contents.map((item: IContentItem) => {
        if (item.type === 'FOLDER') {
            return <FolderItem key={item.id} item={item} toggleModal={toggleModal} modalActive={modalActive} renderContents={renderContents} handleContextMenu={handleContextMenu} />;
        } else {
            return <FileItem key={item.id} item={item} handleContextMenu={handleContextMenu} />;
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
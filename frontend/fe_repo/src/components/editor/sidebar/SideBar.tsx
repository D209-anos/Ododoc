import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../../../css/components/editor/SideBar.module.css'
import PencilImage from '../../../assets/images/icon/pencil.png'
import FolderImage from '../../../assets/images/icon/forder.png'
import FileImage from '../../../assets/images/icon/file.png'
import Line from '../../../assets/images/mark/line.png'
import MakeFileImage from '../../../assets/images/mark/plusbutton.png'
import AddButton from '../../../assets/images/mark/addbutton.png'
import TrashButton from '../../../assets/images/icon/trashIcon.png'
import SettingButton from '../../../assets/images/icon/settingIcon.png'
import FileAddModal from '../sidebar/modal/FileAddModal'
import TrashModal from '../../editor/sidebar/modal/TrashModal'
import SettingModal from './modal/SettingModal'
import ContextMenu from './ContextMenu';
import useHandleClickOutside from '../../../hooks/useHandleClickOutside';
import useContextMenu from '../../../hooks/useContextMenu';


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
                        "id": 13,
                        "type": "FOLDER",
                        "name": "file13",
                        "contents": [
                            {
                                "id": 13,
                                "type": "FILE",
                                "name": "file13",
                                "contents": "13번입니다."
                            },
                            {
                                "id": 13,
                                "type": "FILE",
                                "name": "fileSDFSDFWDFSFSDFSDFSD",
                                "contents": "13번입니다."
                            },
                            {
                                "id": 13,
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
    const [folderName, setFolderName] = useState<string>(dummyData.name);               // 폴더 이름 저장

    const { menuState, handleContextMenu, hideMenu } = useContextMenu();
    const contextMenuRef = useRef<HTMLUListElement>(null);
    useHandleClickOutside(contextMenuRef, hideMenu);

    const toggleModal = (id: number): void => {
        setModalActive(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const saveName = () => {
        setIsEditing(false);
        // 사용자 이름 수정 API 호출 코드 작성
    };

    const handleNameSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        saveName();
    };

    const handlePencilClick = (): void => {
        setIsEditing(true);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
        saveName();
    };

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setFolderName(event.target.value);
    };

    // 폴더명 수정 함수
    const renderNameField = (): JSX.Element => {
        if (isEditing) {
            return (
                <form onSubmit={handleNameSubmit}>
                    <input
                        type="text"
                        value={folderName}
                        onChange={handleNameChange}
                        onBlur={handleBlur}
                        autoFocus
                        className={Sidebar.renderNameField}
                        style={{ fontFamily: 'hanbitFont'}}
                    />
                </form>
            );
        }
        return <div className={Sidebar.nickname} style={{ fontFamily: 'hanbitFont' }}>{folderName}</div>;
    };

    const renderContents = (contents: IContentItem[]): JSX.Element[] => {
        return contents.map((item: IContentItem) => {
            if (item.type === 'FOLDER') {
                // FOLDER 타입일 경우 하위 항목 추가
                return (
                    <div key={item.id} style={{ marginLeft: '20px' }} className={Sidebar.forderSpace} onContextMenu={(e) => handleContextMenu(e, item.id)}>
                    <div className={Sidebar.folderWrapper}>
                        <img src={FolderImage} alt="folder-image" className={Sidebar.forderImage} />
                        <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>{item.name}</div>
                        <div>
                            <img src={AddButton} alt="add-button" className={Sidebar.addButton} onClick={() => toggleModal(item.id)} />
                            {modalActive[item.id] && (
                                <FileAddModal isOpen={modalActive[item.id]} onClose={() => toggleModal(item.id)}>
                                    <h2>Modal Title</h2>
                                    <p>This is modal content!</p>
                                </FileAddModal>
                            )}
                        </div>
                    </div>
                    {item.contents && Array.isArray(item.contents) && renderContents(item.contents)}
                </div>
                );
            } else {
                // FILE 타입일 경우 contents를 문자열로 취급
                return (
                    <div key={item.name} style={{ marginLeft: '20px' }} className={Sidebar.fileSpace} onContextMenu={(e) => handleContextMenu(e, item.id)}>
                        <img src={FileImage} alt="file-image" className={Sidebar.fileImage} />
                        <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.fileName}>{item.name}</div>
                    </div>
                );
            }
        });
    }

    return (
        <div className={Sidebar.sidebar}>
            <span className={Sidebar.nicknameSpace}>
                {renderNameField()}
                <img src={PencilImage} alt="pencil-image" className={Sidebar.pencil}  onClick={handlePencilClick}/>
            </span>
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
import React, { useState, useRef, RefObject, useEffect, ChangeEvent, FormEvent } from 'react';
import Sidebar from '../../css/components/editor/SideBar.module.css'
import PencilImage from '../../assets/images/icon/pencil.png'
import FolderImage from '../../assets/images/icon/forder.png'
import FileImage from '../../assets/images/icon/file.png'
import Line from '../../assets/images/mark/line.png'
import MakeFileImage from '../../assets/images/mark/plusbutton.png'
import AddButton from '../../assets/images/mark/addbutton.png'
import TrashButton from '../../assets/images/icon/trashIcon.png'
import SettingButton from '../../assets/images/icon/settingIcon.png'
import AddModal from '../../components/editor/sidebar/modal/FileAddModal'
import TrashModal from '../../components/editor/sidebar/modal/TrashModal'
import SettingModal from '../../components/editor/sidebar/modal/SettingModal'
import EditIcon from '../../assets/images/icon/editIcon.png'
import DeleteIcon from '../../assets/images/icon/deleteIcon.png'

interface IContentItem {
    id: number;
    type: 'FOLDER' | 'FILE';
    name: string;
    contents?: string | IContentItem[];
}

// GET 요청 받아올 임시 데이터
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
                        "id": 11,
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
                                "id": 12,
                                "type": "FILE",
                                "name": "file13",
                                "contents": "13번입니다."
                            },
                            {
                                "id": 14,
                                "type": "FILE",
                                "name": "fileSDFSDFWDFSFSDFSDFSD",
                                "contents": "13번입니다."
                            },
                            {
                                "id": 15,
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
    const [modalActive, setModalActive] = useState<Record<number, boolean>>({});
    const [isTrashModalOpen, setTrashModalOpen] = useState<boolean>(false);
    const [isSettingModalOpen, setSettingModalOpen] = useState<boolean>(false);
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number }>({ visible: false, x: 0, y: 0 });
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [folderName, setFolderName] = useState<string>(dummyData.name);

    const toggleModal = (id: number): void => {
        setModalActive(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const saveName = () => {
        setIsEditing(false);
        // 사용자 이름 수정 API 호출하는 부분
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


     // 오른쪽 마우스 클릭
    const handleRightClick = (event: React.MouseEvent<HTMLDivElement>, id: number): void => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.clientX,
            y: event.clientY
        });
    };

    // 메뉴 외부 클릭 핸들러
    const handleClickOutside = (event: MouseEvent): void => {
        if (contextMenu.visible && !(event.target as HTMLElement).closest(`.${Sidebar.contextMenu}`)) {
            setContextMenu({ ...contextMenu, visible: false });
        }
    };

    // 메뉴 외부 클릭 시 닫히는 로직
    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        }
    }, []);

    // 우클릭 컴포넌트 바깥쪽 클릭시 모달 닫히는 로직
    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (contextMenu.visible && !event.target.closest(`.${Sidebar.contextMenu}`)) {
    //             setContextMenu({ ...contextMenu, visible: false });
    //         }
    //     };

    //     document.addEventListener('click', handleClickOutside, true);
    //     return () => {
    //         document.removeEventListener('click', handleClickOutside, true);
    //     }
    // }, [contextMenu]);

    // // 나머지 컴포넌트 구현은 이전 코드를 따릅니다.
    // return (
    //     <div className={Sidebar.sidebar}>
    //         {/* 렌더링 및 이벤트 핸들러 로직 */}
    //     </div>
    // );


    // 오른쪽 마우스 옵션 UI
    const renderContextMenu = () => {
        if (!contextMenu.visible) return null;
        
        return (
            <ul className={Sidebar.contextMenu} style={{ position: 'fixed', top: `${contextMenu.y}px`, left: `${contextMenu.x}px`, zIndex: 1000 }}>
                <div className={Sidebar.editWrapper}>
                    <img src={EditIcon} alt="edit-icon" className={Sidebar.editIcon}/>
                    <div className={Sidebar.rightClickEdit} style={{fontFamily: 'hanbitFont'}} >수정하기</div>
                </div>
                <hr />
                <div className={Sidebar.deleteWrapper}>
                    <img src={DeleteIcon} alt="delete-icon" className={Sidebar.deleteIcon}/>
                    <div onClick={() => console.log('삭제')} className={Sidebar.rightClickDelete} style={{fontFamily: 'hanbitFont'}}>삭제하기</div>
                </div>
            </ul>
        );
    };


    const renderContents = (contents: IContentItem[]): JSX.Element[] => {
        return contents.map((item: IContentItem) => {
            if (item.type === 'FOLDER') {
                // FOLDER 타입일 경우 하위 항목 추가
                return (
                    <div key={item.id} style={{ marginLeft: '20px' }} className={Sidebar.forderSpace} onContextMenu={(e) => handleRightClick(e, item.id)}>
                    <div className={Sidebar.folderWrapper}>
                        <img src={FolderImage} alt="folder-image" className={Sidebar.forderImage} />
                        <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>{item.name}</div>
                        <div>
                            <img src={AddButton} alt="add-button" className={Sidebar.addButton} onClick={() => toggleModal(item.id)} />
                            {modalActive[item.id] && (
                                <AddModal isOpen={modalActive[item.id]} onClose={() => toggleModal(item.id)}>
                                    <h2>Modal Title</h2>
                                    <p>This is modal content!</p>
                                </AddModal>
                            )}
                        </div>
                    </div>
                    {item.contents && Array.isArray(item.contents) && renderContents(item.contents)}
                </div>
                );
            } else {
                // FILE 타입일 경우 contents를 문자열로 취급
                return (
                    <div key={item.name} style={{ marginLeft: '20px' }} className={Sidebar.fileSpace} onContextMenu={(e) => handleRightClick(e, item.id)}>
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
                {/* <div className={Sidebar.nickname} style={{ fontFamily: 'hanbitFont'}}>{dummyData.name}</div> */}
                <img src={PencilImage} alt="pencil-image" className={Sidebar.pencil}  onClick={handlePencilClick}/>
            </span>
            <img src={Line} alt="line" className={Sidebar.line}/>
            {renderContents(dummyData.contents as IContentItem[])}
            {renderContextMenu()}
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
import React, { useState, useRef, useEffect } from 'react';
import '../../css/directory/directory.css';
import Line from '../../images/icon/line.png'
import FolderItem from './FolderItem';
import FileItem from './FileItem';
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
    // const navigate = useNavigate();
    // const [contents, setContents] = useState<IContentItem[]>([]);
    const [modalActive, setModalActive] = useState<Record<number, boolean>>({});        // 파일, 폴더 생성 모달창 열림, 닫힘 여부
    const [isTrashModalOpen, setTrashModalOpen] = useState<boolean>(false);             // 휴지통 모달창 열림, 닫힘 여부
    const [isSettingModalOpen, setSettingModalOpen] = useState<boolean>(false);         // 설정 모달창 열림, 닫힘 여부
    const [isEditing, setIsEditing] = useState<boolean>(false);                         // 사용자 이름 수정 여부
    const [isContentEditing, setIsContentEditing] = useState<boolean>(false);
    // const [userName, setUserName] = useState<string>('');                  // 사용자 이름 수정
    const [userName, setUserName] = useState<string>(dummyData.name);                  // 사용자 이름 수정
    const [selectedId, setSelectedId] = useState<number | null>(null);                  // 선택된 id
    const [selectedItem, setSelectedItem] = useState<IContentItem | null>(null);

    // 디렉토리 조회
    // useEffect(() => {
    //     const loadDirectory = async () => {
    //         const rootId = 1;
    //         const directoryData = await fetchDirectory(rootId);
    //         const token = localStorage.getItem('accessToken')
    //         if (directoryData && token) {
    //             console.log('데이터 들어왔따 ~~~')
    //             console.log(directoryData)
    //             setContents(directoryData.contents as IContentItem[]);
    //             setUserName(directoryData.name);
    //         }
    //     };

    //     loadDirectory();
    // }, [])

    const toggleModal = (id: number): void => {
        setModalActive(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // file 클릭
    const fileItemClick = (id: number): void => {
        // navigate(`/editor/${id}`, {state: id})
        // setSelectedId(id);
        // console.log(id)
    }

    // folder 클릭
    const folderItemClick = (id: number): void => {
        // setSelectedId(id);
        // console.log(id)
    }

    // // 사용자 이름 저장 함수
    // const saveUserName = (objectId: number) => {
    //     setIsEditing(false);
    //     // 사용자 이름 수정 API 호출 코드 작성
    // };

    // 사용자 이름 수정 함수
    const renderNameField = (): JSX.Element => {
        return (
            <div onClick={() => setIsEditing(true)} className="nickname">
                {userName}
            </div>
        );
    };

    // 폴더 및 파일 하위 구조
    const renderContents = (contents: IContentItem[] | undefined, indentLevel: number = 0): JSX.Element[] => {
        if (!contents) return [];

        return contents.map((item: IContentItem) => {
            const className = `item ${indentLevel > 0 ? 'itemIndent' : ''}`; // 하위 요소 들여쓰기
            if (item.type === 'FOLDER') {
                return (
                    <div key={item.id} className={className}>
                        <FolderItem 
                        item={item} 
                        toggleModal={toggleModal} 
                        modalActive={modalActive} 
                        renderContents={() => renderContents(item.contents as IContentItem[], indentLevel + 1)} 
                        handleItemClick={folderItemClick} 
                        selectedItem={selectedItem} 
                        isContentEditing={isContentEditing} 
                        setIsContentEditing={setIsContentEditing} 
                        saveName={saveName}/>
                    </div>
                );
            } else {
                return (
                    <div key={item.id} className={className}>
                        <FileItem 
                        item={item} 
                        selected={item.id === selectedId} 
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

    // 이름 저장
    const saveName = (newName: string) => {
        if (selectedItem) {
            selectedItem.name = newName;
            setIsContentEditing(false);
        } else {
            console.error('No item selected.')
        }
    }    

    return (
        // 사이드바
        <div className="sidebar">
            <div className="nicknameSpace" style={{ fontFamily: 'hanbitFont' }}>
                {renderNameField()}
            </div>
            <img src={Line} alt="line" className="line"/>
            {renderContents(dummyData.contents as IContentItem[])}
        </div>
    )
}

export default SideBar
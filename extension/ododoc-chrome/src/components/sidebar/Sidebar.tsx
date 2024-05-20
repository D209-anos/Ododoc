import React, { useState, useRef, useEffect } from 'react';
import '../../css/directory/directory.css'
import Line from '../../images/icon/line.png'
import Item from './Item';
import Logout from '../../images/icon/logout.png'
import Start from '../../images/icon/start.png'
import Stop from '../../images/icon/stop.png'
import Home from '../../images/icon/sitehome.png'
import Modal from './Modal'
import { fetchDirectory } from '../../service/directory';
import { useAuth } from '../../contexts/AuthContext';


// 디렉토리 타입
interface MyDirectoryItem {
    id: number;
    name: string;
    type: 'FOLDER' | 'FILE';
    children?: MyDirectoryItem[] | string;
}

// Props 타입 정의
interface SidebarProps {
    accessToken: string | null;
    rootId: number | null;
    title: string | null;
    onLogout: () => void;
}

const SideBar: React.FC<SidebarProps> = ({ accessToken, rootId, title, onLogout }) => {
    // const { state } = useAuth();
    // const { accessToken, rootId, title } = state;

    const [contents, setContents] = useState<MyDirectoryItem[]>([]);                       // 디렉토리 내용 (id, name, type, children)
    const [selectedId, setSelectedId] = useState<number | null>(null);                  // 선택된 파일 또는 폴더의 id
    const [selectedName, setSelectedName] = useState<string | null>(null);                  // 선택된 파일 또는 폴더의 id
    const [selectedItem, setSelectedItem] = useState<MyDirectoryItem | null>(null);     // 선택된 파일 또는 폴더의 구조
    const [openFolders, setOpenFolders] = useState<Record<number, boolean>>({});        // 폴더 열림 닫힘 상태
    const [sidebarWidth, setSidebarWidth] = useState<number>(250);                      // 초기 사이드바 너비 설정
    const contextMenuRef = useRef<HTMLUListElement>(null);   
    const [userName, setUserName] = useState<string>(title || '');      
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);                       
    const [isStart, setIsStart] = useState<boolean>(false);
    const [ directoryData, setDirectoryData ] = useState<MyDirectoryItem | null>(null);    // directory data 저장

    // 디렉토리 조회 (로그인 시 title 매핑)
    const loadDirectory = async () => {
        console.log("디렉토리 조회할게요")
        if (accessToken && rootId) {
            const data = await fetchDirectory(rootId, accessToken);
            setDirectoryData(data);
        } else {
            console.log("토큰이나 루트ID가 없어요.")
        }
    };

    useEffect(() => {
        console.log("loadDirectory 실행")
        loadDirectory();
    }, [accessToken, rootId]);

    // 디렉토리 조회 (디렉토리 생성 후 조회)
    useEffect(() => {
        if (directoryData){
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

    // file 클릭    
    const fileItemClick = (id: number, name: string): void => {
        setSelectedId(id);
        setSelectedName(name)
        localStorage.setItem('selectedFileId', id.toString());
        console.log("file Id : ", selectedId)
        console.log("file name : ", selectedName)
        setIsModalOpen(true);
    }

    // selectedId가 변경될 때마다 background.ts로 메시지 전송
    useEffect(() => {
        if (selectedId !== null) {
            console.log("file Id : ", selectedId);
            chrome.runtime.sendMessage({ command: 'fileSelected', fileId: selectedId });
        }
    }, [selectedId]);

    // 컴포넌트가 마운트될 때 로컬 스토리지에서 파일 ID를 로드
    useEffect(() => {
        const storedFileId = localStorage.getItem('selectedFileId');
        console.log(storedFileId)
        if (storedFileId) {
        setSelectedId(Number(storedFileId));
        }
    }, []);

    // folder 클릭
    const folderItemClick = (id: number): void => {
        // setSelectedId(id);
        console.log("folder ID : ", id)
    }

    // 폴더 열기/닫기 상태 관리
    const toggleFolder = (id: number) => {
        setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }))
    }


    // 폴더 및 파일 하위 구조
    const renderContents = (
        children: MyDirectoryItem[] | undefined,
        parentId: number | null,
        indentLevel: number = 0
    ): JSX.Element[] => {
        if (!children) return [];

        return children
            .map((item: MyDirectoryItem) => {
                const isSelected = item.id === selectedId;
                const className = `item ${indentLevel > 0 ? 'itemIndent' : ''} ${isSelected ? 'selected' : ''}`;
                // console.log(`폴더: ${item.name} (ID: ${item.id}) - Parent ID: ${parentId}`);
                return (
                    <div key={item.id} className={className}>
                        <Item
                            item={item}
                            parentId={parentId}
                            renderContents={(contents) => renderContents(contents, item.id, indentLevel + 1)}
                            handleItemClick={item.type === 'FOLDER' ? folderItemClick : fileItemClick}
                            selectedItem={selectedItem}
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

    const handleStartMonitoring = () => {
        console.log("기록 시작할게요");
        setIsStart(true)
        chrome.runtime.sendMessage({ command: "start" });
    };
    
    const handleStopMonitoring = () => {
        console.log("기록 중지할게요");
        setIsStart(false)
        chrome.runtime.sendMessage({ command: "stop" });
    }

    const openHomepage = () => {
        chrome.tabs.create({ url: 'https://k10d209.p.ssafy.io' });
    }

    return (
        // 사이드바
        <div>
            <div className="sidebar">
                <div className="nicknameSpace" style={{ fontFamily: 'hanbitFont' }}>
                    <div className='nickname'>{userName}</div>
                </div>
                <img src={Line} alt="line" className="line"/>
                    {renderContents(contents, null)}
                <div className='sideButtonWrapper'>
                    <img src={Home} alt="Hoem-button" className="makeFileButton" onClick={openHomepage}/>
                    <img src={Start} alt="start-button" className="makeFileButton" onClick={handleStartMonitoring}/> 
                    <img src={Stop} alt="stop-button" className="makeFileButton" onClick={handleStopMonitoring}/>
                    <img src={Logout} alt="logout-button" className="makeFileButton" onClick={onLogout}/>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} name={selectedName} />
            {/* <div className="buttons-container">
                <button onClick={handleStartMonitoring}>기록 시작</button>
                <button onClick={handleStopMonitoring}>기록 중지</button>
            </div> */}
        </div>
    )
}

export default SideBar
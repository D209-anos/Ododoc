import React, { useState, useRef, useEffect } from 'react';
import '../../css/directory/directory.css';
import Line from '../../images/icon/line.png'
import FolderItem from './FolderItem';
import FileItem from './FileItem';
import { fetchDirectory } from '../../service/directory';

// Props 타입 정의
interface SidebarProps {
    accessToken: string | null;
    rootId: string | null;
    title: string | null;
  }

// 디렉토리 타입
interface MyDirectoryItem {
    id: number;
    name: string;
    type: 'FOLDER' | 'FILE';
    children?: MyDirectoryItem[] | string;
}

const adress = "ws://192.168.0.6:18080/process/ws";

const SideBar: React.FC<SidebarProps> = ({ accessToken, rootId, title }) => {
    console.log(accessToken, rootId, title)
    const [monitoring, setMonitoring] = useState<boolean>(false);
    const [contents, setContents] = useState<MyDirectoryItem[]>([]);   
    const [modalActive, setModalActive] = useState<Record<number, boolean>>({});        // 파일, 폴더 생성 모달창 열림, 닫힘 여부
    const [isContentEditing, setIsContentEditing] = useState<boolean>(false);
    // const [userName, setUserName] = useState<string>('');                  // 사용자 이름 수정
    const [userName, setUserName] = useState<string>(title || '');                  // 사용자 이름 수정
    const [selectedId, setSelectedId] = useState<number | null>(null);                  // 선택된 id
    const [selectedItem, setSelectedItem] = useState<MyDirectoryItem | null>(null);
    const [ directoryData, setDirectoryData ] = useState<MyDirectoryItem | null>(null);    // directory data 저장

    // 디렉토리 조회 (로그인 시 title 매핑)
    useEffect(() => {
        const loadDirectory = async () => {
            if (accessToken && rootId) {
                console.log(accessToken, rootId);
                const rootIdNumber = Number(rootId);
                const data = await fetchDirectory(rootIdNumber, accessToken);
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

    const toggleModal = (id: number): void => {
        setModalActive(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // file 클릭
    const fileItemClick = (id: number): void => {
        // navigate(`/editor/${id}`, {state: id})
        setSelectedId(id);
        console.log(selectedId)
    }

    // folder 클릭
    const folderItemClick = (id: number): void => {
        // setSelectedId(id);
        // console.log(id)
    }

    // 폴더 및 파일 하위 구조
    const renderContents = (
            children: MyDirectoryItem[] | undefined, 
            parentId: number | null, 
            indentLevel: number = 0
    ): JSX.Element[] => {
        if (!children) return [];

        return children.map((item: MyDirectoryItem) => {
            const className = `item ${indentLevel > 0 ? 'itemIndent' : ''}`; // 하위 요소 들여쓰기
            if (item.type === 'FOLDER') {
                return (
                    <div key={item.id} className={className}>
                        <FolderItem 
                        item={item} 
                        parentId={parentId}
                        toggleModal={toggleModal} 
                        modalActive={modalActive} 
                        renderContents={() => renderContents(item.children as MyDirectoryItem[], item.id, indentLevel + 1)} 
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
                        parentId={item.id}
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

    // 이름 저장
    const saveName = (newName: string) => {
        if (selectedItem) {
            selectedItem.name = newName;
            setIsContentEditing(false);
        } else {
            console.error('No item selected.')
        }
    }    

    /**  웹소켓 코드 */
    const socket = useRef<WebSocket | null>(null);

    useEffect(() => {
        socket.current = new WebSocket(adress);
        console.log("WebSocketClient created");

        socket.current.onopen = () => {
            console.log("Connection established");
            // socket.current?.send("Hello Server!");
            const messageData = {
                sourceApplication: "Chrome",
                accessToken: accessToken,
                connectedFileId: 1,
                dataType: "SIGNAL",
                content: "Test message from React",
                timestamp: new Date()
            };

            const messageJson = JSON.stringify(messageData); // 객체를 JSON 문자열로 변환
            if (socket.current) { // socket.current가 null이 아닐 때만 send 호출
                socket.current.send(messageJson); // JSON 문자열을 보냄
            } else {
                console.error("WebSocket connection is not established.");
            }

        };

        socket.current.onmessage = (event) => {
            console.log("Message from server:", event.data);
        };

        socket.current.onerror = (error) => {
            console.error("WebSocket 에러:", error);
        };

        socket.current.onclose = () => {
            console.log("소켓 닫혔어요");
        };

        const handleTabUpdate = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
            if (monitoring && changeInfo.status === 'complete' && tab.url) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: getHtml
                }, (results) => {
                    if (results[0]) {
                        const pageHtml = results[0].result;
                        let message = '';

                        if (tab.url && tab.url.startsWith('https://www.google.com/search')) {
                            const urlParams = new URLSearchParams(new URL(tab.url).search);
                            const searchQuery = urlParams.get('q') || 'Unknown Search'; // 검색어 추출
                            message = JSON.stringify({
                                type: 'search',
                                query: searchQuery
                            });
                        } else {
                            message = JSON.stringify({
                                type: 'page',
                                url: tab.url,
                                html: pageHtml
                            });
                        }

                        const messageData = {
                            sourceApplication: "Chrome",
                            accessToken: accessToken,
                            connectedFileId: 1,
                            dataType: "SIGNAL",
                            content: message,
                            timestamp: new Date()
                        };
                        const messageJson = JSON.stringify(messageData); // 객체를 JSON 문자열로 변환
                        if (socket.current) { // socket.current가 null이 아닐 때만 send 호출
                            socket.current.send(messageJson); // JSON 문자열을 보냄
                        } else {
                            console.error("WebSocket connection is not established.");
                        }
                    }
                });
            }
        };
      
        const getHtml = () => document.documentElement.outerHTML;

        chrome.tabs.onUpdated.addListener(handleTabUpdate);

        // Cleanup on component unmount
        return () => {
            socket.current?.close();
            chrome.tabs.onUpdated.removeListener(handleTabUpdate);
        };
    }, [monitoring]);

    const handleStartMonitoring = () => {
        console.log("기록 시작할게요");
        setMonitoring(true);
    };
    
      const handleStopMonitoring = () => {
        console.log("기록 중지할게요");
        setMonitoring(false);
    };

    

    // const sendMessage = (message: string) => {
    //     const messageObject = { text: message };

    //     if (socket.current && socket.current.readyState === WebSocket.OPEN) {
    //         socket.current.send(messageObject);
    //     } else {
    //         console.log("Connection not ready.");
    //     }
    // };
    /***********************  웹소켓 코드 *********************************/


    return (
        // 사이드바
        <div>
            <div className="sidebar">
                <div className="nicknameSpace" style={{ fontFamily: 'hanbitFont' }}>
                    <div className='nickname'>{userName}</div>
                </div>
                <img src={Line} alt="line" className="line"/>
                {renderContents(contents, null)}
            </div>
            <div className="buttons-container">
                <button onClick={handleStartMonitoring}>Start</button>
                <button onClick={handleStopMonitoring}>Stop</button>
            </div>
        </div>
    )
}

export default SideBar
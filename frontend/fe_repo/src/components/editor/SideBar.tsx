import React from 'react';
import Sidebar from '../../css/components/editor/SideBar.module.css'
import PencilImage from '../../assets/images/pencil.png'
import FolderImage from '../../assets/images/forder.png'
import FileImage from '../../assets/images/file.png'
import Line from '../../assets/images/line.png'
import MakeFileImage from '../../assets/images/plusbutton.png'
import AddButton from '../../assets/images/addbutton.png'

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
                                "name": "file13sfdsfdsfsdfsdfdsf",
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

function SideBar() {
    const renderContents = (contents: IContentItem[]): JSX.Element[] => {
        return contents.map((item: IContentItem) => {
            if (item.type === 'FOLDER') {
                // FOLDER 타입일 경우 하위 항목 추가
                return (
                    <div key={item.name} style={{ marginLeft: '20px' }} className={Sidebar.forderSpace}>
                        <div className={Sidebar.folderWrapper}>
                            <img src={FolderImage} alt="folder-image" className={Sidebar.forderImage} />
                            <div style={{ fontFamily: 'hanbitFont' }} className={Sidebar.folderName}>{item.name}</div>
                            <img src={AddButton} alt="add-button" className={Sidebar.addButton} />
                        </div>
                        {renderContents(item.contents as IContentItem[])}
                    </div>
                );
            } else {
                // FILE 타입일 경우 contents를 문자열로 취급
                return (
                    <div key={item.name} style={{ marginLeft: '20px' }} className={Sidebar.fileSpace}>
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
                <div className={Sidebar.nickname} style={{ fontFamily: 'hanbitFont'}}>{dummyData.name}</div>
                <img src={PencilImage} alt="pencil-image" className={Sidebar.pencil} />
            </span>
            <img src={Line} alt="line" className={Sidebar.line}/>
            {renderContents(dummyData.contents as IContentItem[])}
            <img src={MakeFileImage} alt="make-file-button" className={Sidebar.makeFileButton}/>
        </div>
    )
}

export default SideBar
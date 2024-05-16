import React, { useState } from 'react';
import CountUp from 'react-countup';
import { fetchProfile } from '../../../api/service/mypage';
import lv1 from "../../../assets/images/mypage/lv1.webp";
import lv2 from "../../../assets/images/mypage/lv2.webp";
import lv3 from "../../../assets/images/mypage/lv3.webp";
import lv4 from "../../../assets/images/mypage/lv4.webp";
import lv5 from "../../../assets/images/mypage/lv5.webp";
import lv6 from "../../../assets/images/mypage/lv6.webp";
import lv7 from "../../../assets/images/mypage/lv7.webp";
import lv8 from "../../../assets/images/mypage/lv8.webp";
import lv9 from "../../../assets/images/mypage/lv9.webp";
import lv10 from "../../../assets/images/mypage/lv10.webp";
import lv11 from "../../../assets/images/mypage/lv11.webp";
import lv12 from "../../../assets/images/mypage/lv12.webp";
import lv13 from "../../../assets/images/mypage/lv13.webp";
import lv14 from "../../../assets/images/mypage/lv14.webp";

function Mypage() {

    const [errorCount, setErrorCount] = useState(0); // 예시 데이터
    const [websiteVisits, setWebsiteVisits] = useState(0);
    const [builds, setBuilds] = useState(0);
    const [keywordSearches, setKeywordSearches] = useState(0);
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        fetchProfile(accessToken).then(data => {
            console.log('Directory data:', data);
            setErrorCount(data.errorCount);
            setBuilds(data.buildCount)
            setKeywordSearches(data.searchCount)
            setWebsiteVisits(data.visitCount)
        }).catch(error => {
            console.error('Error fetching directory:', error);
        });
    }

    const totalCount = errorCount + websiteVisits + builds + keywordSearches;

    let nickname = "";

    if (totalCount <= 1000) {
        nickname = "초보 탐험가";
    } else if (totalCount <= 3000) {
        nickname = "준비된 여행자";
    } else if (totalCount <= 6000) {
        nickname = "경험 많은 탐험가";
    } else if (totalCount <= 10000) {
        nickname = "던전 마스터";
    } else if (totalCount <= 15000) {
        nickname = "숙련된 아키텍트";
    } else if (totalCount <= 21000) {
        nickname = "소프트웨어 세이지";
    } else if (totalCount <= 28000) {
        nickname = "코드 마법사"
    } else if (totalCount <= 36000) {
        nickname = "시스템 영웅"
    } else if (totalCount <= 45000) {
        nickname = "아키텍처 도술사"
    } else if (totalCount <= 55000) {
        nickname = "알고리즘 연금술사"
    } else if (totalCount <= 66000) {
        nickname = "오픈 소스의 구원자"
    } else if (totalCount <= 78000) {
        nickname = "프레임워크 혁신가"
    } else if (totalCount <= 91000) {
        nickname = "기술 통솔자"
    } else if (totalCount > 91000) {
        nickname = "코드의 전설"
    }

    // 닉네임에 따른 이미지 이름 매핑
    const nicknameToImage = {
        "초보 탐험가": lv1,
        "준비된 여행자": lv2,
        "경험 많은 탐험가": lv3,
        "던전 마스터": lv4,
        "숙련된 아키텍트": lv5,
        "소프트웨어 세이지": lv6,
        "코드 마법사": lv7,
        "시스템 영웅": lv8,
        "아키텍처 도술사": lv9,
        "알고리즘 연금술사": lv10,
        "오픈 소스의 구원자": lv11,
        "프레임워크 혁신가": lv12,
        "기술 통솔자": lv13,
        "코드의 전설": lv14
    };

    //@ts-ignore
    const imageForNickname = nicknameToImage[nickname] || levels.lv1; // 기본 이미지 설정


    // 각 레벨에 해당하는 문구를 객체로 매핑
    const levelToQuote = {
        "초보 탐험가": " 모험의 첫 발을 디딘 당신, 작은 실수에서 교훈을 얻고,\n기본기를 탄탄히 다지세요. 모든 위대한 여정은 이 첫 걸음에서 시작됩니다.",
        "준비된 여행자": " 이제 당신은 길을 알아볼 줄 아는 여행자가 되었습니다.\n 앞으로 마주할 다양한 도전을 맞이할 준비를 하세요.\n 각 단계마다 배우는 것을 두려워하지 마세요.",
        "경험 많은 탐험가": " 여러 도전을 겪으며 이제 당신은 더 넓은 세상을 경험하기 시작했습니다.\n얻은 지식을 바탕으로 더 복잡한 문제들을 해결할 수 있는 방법을 모색하세요.",
        "던전 마스터": " 던전의 깊은 곳까지 탐험해본 당신은 이제 어떤 난관도 헤쳐나갈 준비가 되어 있습니다.\n 다양한 도구와 기술을 사용하여 미지의 영역을 정복하세요.",
        "숙련된 아키텍트": " 이제 당신은 복잡한 시스템을 설계하고 구축할 수 있는 능력을 갖췄습니다.\n 견고한 기초 위에 창의적이고 혁신적인 구조를 만들어보세요.",
        "소프트웨어 세이지": " 당신의 지혜는 많은 이들에게 영감을 줍니다.\n 새로운 기술을 배우고 가르치며, 소프트웨어의 근본적인 문제들에 대한 해답을 제시하세요.",
        "코드 마법사": " 코드를 통해 마법과 같은 일을 해내는 당신,\n복잡한 코드도 단순하게 만들어 효율성을 극대화할 수 있는 방법을 찾아보세요.",
        "시스템 영웅": " 시스템의 깊은 이해를 바탕으로 큰 규모의 문제를 해결하는 영웅이 되었습니다.\n 크고 작은 시스템을 연결하여 강력한 네트워크를 구축하세요.",
        "아키텍처 도술사": " 당신의 손길이 닿는 모든 아키텍처는 눈에 띄게 변화하고 발전합니다.\n 더 나은 설계를 위해 지금까지 배운 지식을 적극적으로 활용하세요.",
        "알고리즘 연금술사": " 알고리즘과 데이터 구조의 마스터로서, 당신은 데이터의 황금을 추출할 수 있습니다.\n 더 빠르고 효율적인 솔루션을 창조하세요.",
        "오픈 소스의 구원자": " 당신의 기술로 많은 오픈 소스 프로젝트가 새로운 생명을 얻습니다.\n 커뮤니티와 협력하여 지식을 공유하고, 오픈 소스 세계에 기여하세요.",
        "프레임워크 혁신가": " 기존의 틀을 깨고 새로운 프레임워크를 창조하여 업계에 혁신을 가져오세요.\n 당신의 혁신적인 아이디어가 미래의 기준이 됩니다.",
        "기술 통솔자": " 기술의 최전선에서 리더십을 발휘하세요.\n 복잡한 기술적 도전을 성공적으로 이끌어, 당신의 팀이 더 큰 성과를 낼 수 있도록 하세요.",
        "코드의 전설": " 당신은 이제 전설적인 존재가 되었습니다.\n 후세에 당신의 업적이 오래도록 회자될 것입니다.\n 계속해서 새로운 경지를 개척하며, 영원한 영향을 끼치세요."
    };

    // 컴포넌트 내에서 레벨에 따라 문구를 표시하는 부분
    //@ts-ignore
    const quoteForLevel = levelToQuote[nickname]; // 닉네임에 해당하는 문구를 가져옴

    return (
        <div style={{width: '100%' ,textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div style={{ width: '100%', height: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                <h1 style={{fontSize : '3rem'}}>개발 경험치</h1>
                <CountUp
                    end={totalCount}
                    duration={2.75}
                    separator=","
                    suffix="  EXP"
                    style={{ fontSize: '10rem', color: 'orange' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '40px' }}>
                    <div>
                        <h2>에러 발견</h2>
                        <CountUp end={errorCount} duration={2.75} separator="," />
                    </div>
                    <div>
                        <h2>사이트 방문</h2>
                        <CountUp end={websiteVisits} duration={2.75} separator="," />
                    </div>
                    <div>
                        <h2>빌드 성공</h2>
                        <CountUp end={builds} duration={2.75} separator="," />
                    </div>
                    <div>
                        <h2>검색 횟수</h2>
                        <CountUp end={keywordSearches} duration={2.75} separator="," />
                    </div>
                </div>
            </div>
            <div style={{ width: '100%', height: '100vh' }}>
                <h1 style={{ marginTop: '10%' }}>당신은 <span style={{ color: 'orange' }}>{nickname}</span> 입니다</h1>
                <br />
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height : '70%' }}>
                    <img src={imageForNickname} alt="Profile" style={{ width: '50%', height: '100%' }} />
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '45%',
                        height: '100%'
                    }}>
                        <h2 style={{ whiteSpace: 'pre-wrap', textAlign: 'left' }}>{quoteForLevel}</h2>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Mypage;

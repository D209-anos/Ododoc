import React, { useState } from "react";
import CountUp from "react-countup";
import { fetchProfile } from "../../../api/service/mypage";
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
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    fetchProfile(accessToken)
      .then((data) => {
        console.log("Directory data:", data);
        setErrorCount(data.errorCount);
        setBuilds(data.buildCount);
        setKeywordSearches(data.searchCount);
        setWebsiteVisits(data.visitCount);
      })
      .catch((error) => {
        console.error("Error fetching directory:", error);
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
    nickname = "코드 마법사";
  } else if (totalCount <= 36000) {
    nickname = "시스템 영웅";
  } else if (totalCount <= 45000) {
    nickname = "아키텍처 도술사";
  } else if (totalCount <= 55000) {
    nickname = "알고리즘 연금술사";
  } else if (totalCount <= 66000) {
    nickname = "오픈 소스의 구원자";
  } else if (totalCount <= 78000) {
    nickname = "프레임워크 혁신가";
  } else if (totalCount <= 91000) {
    nickname = "기술 통솔자";
  } else if (totalCount > 91000) {
    nickname = "코드의 전설";
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
    "코드의 전설": lv14,
  };

  //@ts-ignore
  const imageForNickname = nicknameToImage[nickname] || levels.lv1; // 기본 이미지 설정

  return (
    <div
      style={{
        textAlign: "center",
        padding: "20px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        height: "85vh",
      }}
    >
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        <h1>개발 경험치</h1>
        <CountUp
          end={totalCount}
          duration={2.75}
          separator=","
          suffix="  EXP"
          style={{ fontSize: "10rem", color: "orange" }}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <div style={{ width: "40%" }}>
            <h2>에러 발견</h2>
            <CountUp
              end={errorCount}
              duration={2.75}
              separator=","
              style={{ fontSize: "3rem" }}
            />
          </div>
          <div style={{ width: "40%" }}>
            <h2>사이트 방문</h2>
            <CountUp
              end={websiteVisits}
              duration={2.75}
              separator=","
              style={{ fontSize: "3rem" }}
            />
          </div>
          <div style={{ width: "40%" }}>
            <h2>빌드 성공</h2>
            <CountUp
              end={builds}
              duration={2.75}
              separator=","
              style={{ fontSize: "3rem" }}
            />
          </div>
          <div style={{ width: "40%" }}>
            <h2>검색 횟수</h2>
            <CountUp
              end={keywordSearches}
              duration={2.75}
              separator=","
              style={{ fontSize: "3rem" }}
            />
          </div>
        </div>
      </div>
      <div style={{ width: "50%" }}>
        <h1>
          당신은 <span style={{ color: "orange" }}>{nickname}</span> 입니다
        </h1>
        <br />
        <img
          src={imageForNickname}
          alt="Profile"
          style={{ width: "100%", height: "90%" }}
        />
      </div>
    </div>
  );
}

export default Mypage;

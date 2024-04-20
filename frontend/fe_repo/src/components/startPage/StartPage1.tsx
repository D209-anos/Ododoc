
import BlackLogoMark from "../../assets/images/blacklogomark.png"
import styles from "../../css/components/StartPage1.module.css"
import React, { useEffect, useState } from 'react';
import startPage1 from "../../css/components/StartPage1.module.css"
import BlackLogoImg from "../../assets/images/blacklogoimg.png"
import { start } from 'repl';
import { ReactTyped } from "react-typed";


interface StartPage1Props {
    backgroundColor: string;
    opacity: number;
    textColor: string;
}

function StartPage1(props: StartPage1Props) {
    return (
        <>
            <header className={startPage1.nav}>
                <img src={BlackLogoMark} alt="black-logo-mark" style={{
                    width: 220,
                    height: 80
                }} />
            </header>
            <section className={startPage1.start1} style={{
                background: props.backgroundColor,
            }}>

                <div className={startPage1.main}>
                    <div className={startPage1.mainImg}>
                        <img src={BlackLogoImg} alt="black-logo-mark" className={startPage1.mainlogoPosition} />
                    </div>
                    <div className={`${startPage1.bmjuaFont} ${startPage1.mainText} ${startPage1.fontWhiteColor}`}>
                        <ReactTyped
                            strings={['번거롭게 정리에 시간쓰지 마세요', '개발과 정리를 한 번에 해보세요', '개발기록과 검색결과를 요약해드립니다', '에디터로 직접 문서 정리 가능해요', '여러분은 개발에 더 집중하세요']}
                            typeSpeed = {40}
                            backSpeed = {25}
                            loop
                            shuffle
                        />
                    </div>
                </div>
                <div className={startPage1.textWrapper}>
                    <div className={`${startPage1.bmjuaFont} ${startPage1.text}`} style={{ color: props.textColor }}>
                        <span className={startPage1.textTitle}>
                            <p>개발과 정리를 한 번에</p>
                        </span>
                        <span className={startPage1.textContent}>
                            개발 과정 기록은 저희에게 맡기고 개발에만 집중하세요 <br />
                            검색결과, 작성코드, 오류정보를 정확히 추출해 드립니다 <br />
                            기록과정이 번거로웠던 당신을 위한 서비스 <br />
                            개발도 문서 정리도, 이제는 한 번에 해결하세요
                        </span>
                    </div>
                </div>
            </section>
        </>
    )
}

export default StartPage1
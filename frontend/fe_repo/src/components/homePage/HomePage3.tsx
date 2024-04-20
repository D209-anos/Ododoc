import React from 'react';
import HomePage3 from '../../css/components/Home3.module.css'
import EditorErrorPage from '../../assets/images/editorErrorpage.png'
import ErrorScreen from '../../assets/images/errorScreen.png'
import SuccessScreen from '../../assets/images/successScreen.png'
import NextVector from '../../assets/images/nextVector.png'

interface StartPage3Props {
    backgroundColor: string;
    textColor: string;
}

function StartPage3 (props: StartPage3Props) {
    return (
        <section className={HomePage3.container} style={{ backgroundColor: props.backgroundColor }}>
            <div className={HomePage3.textArea}>
                <p className={`${HomePage3.bmjuaFont} ${HomePage3.heading}`}>어떤 코드로 성공 실패했는지 한눈에</p>
                <p className={`${HomePage3.hanbitFont} ${HomePage3.subheading}`} style={{ color: props.textColor}}>모든 트러블 슈팅 코드를 확인할 수 있어요.</p>
            </div>
            <div className={HomePage3.splitContainer}>
                <div className={HomePage3.leftHalf}>
                    <img src={ErrorScreen} alt="error-screen" className={HomePage3.ErrorScreen}/>
                    <img src={SuccessScreen} alt="success-screen" className={HomePage3.SuccessScreen}/>
                </div>
                <div className={HomePage3.rightHalf}>
                    <img src={EditorErrorPage} alt="editor-error-page" className={HomePage3.EditorErrorPage} />
                </div>
            </div>
            <img src={NextVector} alt="next-vector" className={HomePage3.NextVector} />
        </section>
    )
}

export default StartPage3
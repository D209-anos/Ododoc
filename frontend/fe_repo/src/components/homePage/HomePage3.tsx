import React from 'react';
import styles from '../../css/components/StartPage3.module.css'
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
        <section className={styles.container} style={{ backgroundColor: props.backgroundColor }}>
            <div className={styles.textArea}>
                <p className={`${styles.bmjuaFont} ${styles.heading}`}>어떤 코드로 성공 실패했는지 한눈에</p>
                <p className={`${styles.hanbitFont} ${styles.subheading}`} style={{ color: props.textColor}}>모든 트러블 슈팅 코드를 확인할 수 있어요.</p>
            </div>
            <div className={styles.splitContainer}>
                <div className={styles.leftHalf}>
                    <img src={ErrorScreen} alt="error-screen" className={styles.ErrorScreen}/>
                    <img src={SuccessScreen} alt="success-screen" className={styles.SuccessScreen}/>
                </div>
                <div className={styles.rightHalf}>
                    <img src={EditorErrorPage} alt="editor-error-page" className={styles.EditorErrorPage} />
                </div>
            </div>
            <img src={NextVector} alt="next-vector" className={styles.NextVector} />
        </section>
    )
}

export default StartPage3
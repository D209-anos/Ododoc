import React from "react";
import BlackLogoMark from "../../assets/images/blacklogomark.png"
import styles from "../../css/components/StartPage1.module.css"

interface StartPage1Props {
    backgroundColor: string;
    opacity: number;
}

function StartPage1(props:StartPage1Props) {
    return(
        <div style={{ 
            height: '100vh',
            background: props.backgroundColor, 
            paddingTop: 20,
            position: 'relative'
            }} className={styles.container}>
            <img src={BlackLogoMark} alt="black-logo-mark" className={styles.logoMarkPosition} style={{ 
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: props.opacity,
                width: 220
            }}/>
            {/* <div className='bmjuaFont' style={{ fontSize: 50 }}>
                안녕하세요. 오도독입니다.
            </div> */}
        </div>
    )
}

export default StartPage1
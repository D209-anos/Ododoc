import React from "react";
import "../../css/components/StartPage1.css"
import BlackLogoMark from "../../assets/images/blacklogomark.png"

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
            }}>
            <img src={BlackLogoMark} alt="black-logo-mark" className="logoMarkPosition" style={{ 
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
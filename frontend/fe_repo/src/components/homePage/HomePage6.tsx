import HomePage6 from "../../css/components/Home6.module.css"
import LogotextAni from "../../assets/images/ododoc-orange.gif"

function StartPage6(){
    return(
        <>
        <section className={HomePage6.start6}>
            <div className={HomePage6.textWrapper}>
                <p className={HomePage6.text}>개발 정리는</p>
                <div className={HomePage6.textWrapper2}>
                    <span><img src={LogotextAni} alt="black-logo-mark" className={HomePage6.logo} /></span>
                    <span className={HomePage6.text2}>과 함께</span>
                </div>
            </div>
        </section>
        </>
    )
}

export default StartPage6
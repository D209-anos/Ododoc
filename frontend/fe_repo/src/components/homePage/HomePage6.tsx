import start6 from "../../css/components/StartPage6.module.css"
import LogotextAni from "../../assets/images/ododoc-orange.gif"

function StartPage6(){
    return(
        <>
        <section className={start6.start6}>
            <div className={start6.textWrapper}>
                <p className={start6.text}>개발 정리는</p>
                <div className={start6.textWrapper2}>
                    <span><img src={LogotextAni} alt="black-logo-mark" className={start6.logo} /></span>
                    <span className={start6.text2}>과 함께</span>
                </div>
            </div>
        </section>
        </>
    )
}

export default StartPage6
import Home6 from "../../css/components/homePage/Home6.module.css"
import LogotextAni from "../../assets/images/ododocLogo/ododoc-orange.gif"

function HomePage6(){
    return(
        <>
        <section className={Home6.start6}>
            <div className={Home6.textWrapper}>
                <p className={Home6.text}>개발 정리는</p>
                <div className={Home6.textWrapper2}>
                    <span><img src={LogotextAni} alt="black-logo-mark" className={Home6.logo} /></span>
                    <span className={Home6.text2}>과 함께</span>
                </div>
            </div>
        </section>
        </>
    )
}

export default HomePage6
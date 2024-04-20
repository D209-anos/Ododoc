import HomePage4 from '../../css/components/Home4.module.css'


function StartPage5 (){
    return(
        <>
        <section className={HomePage4.start4}>
            <div className={HomePage4.text}>
                <p className={HomePage4.textTitle}>내가 검색한 내용도 깔끔하게.</p>
                <p className={HomePage4.textContent}>
                    방문한 화면 사이트 
                    <span className={HomePage4.highlight}>요약</span> 및 <span className={HomePage4.highlight}>스크린샷</span>까지 
                    <br />정리해 드려요.
                </p>
            </div>
            <div className={HomePage4.imgWrapper}>
                <div className={HomePage4.img}>
                    <p className={HomePage4.temp}>추후 gif로 캡쳐본 추가</p>
                </div>
            </div>
        </section>
        </>
    )
}

export default StartPage5;
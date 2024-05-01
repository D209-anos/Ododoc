import Home4 from '../../css/components/homePage/Home4.module.css'


function HomePage4 (){
    return(
        <>
        <section className={Home4.start4}>
            <div className={Home4.text}>
                <p className={Home4.textTitle}>내가 검색한 내용도 깔끔하게.</p>
                <p className={Home4.textContent}>
                    방문한 화면 사이트 
                    <span className={Home4.highlight}>요약</span> 및 <span className={Home4.highlight}>스크린샷</span>까지 
                    <br />정리해 드려요.
                </p>
            </div>
            <div className={Home4.imgWrapper}>
                <div className={Home4.img}>
                    <p className={Home4.temp}>추후 gif로 캡쳐본 추가</p>
                </div>
            </div>
        </section>
        </>
    )
}

export default HomePage4;
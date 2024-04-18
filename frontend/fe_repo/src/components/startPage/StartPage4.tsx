import startPage4 from '../../css/components/StartPage4.module.css'


function StartPage5 (){
    return(
        <>
        <section className={startPage4.start4}>
            <div className={startPage4.text}>
                <p className={startPage4.textTitle}>내가 검색한 내용도 깔끔하게.</p>
                <p className={startPage4.textContent}>
                    방문한 화면 사이트 
                    <span className={startPage4.highlight}>요약</span> 및 <span className={startPage4.highlight}>스크린샷</span>까지 
                    <br />정리해 드려요.
                </p>
            </div>
            <div className={startPage4.imgWrapper}>
                <div className={startPage4.img}>
                    <p className={startPage4.temp}>추후 gif로 캡쳐본 추가</p>
                </div>
            </div>
        </section>
        </>
    )
}

export default StartPage5;
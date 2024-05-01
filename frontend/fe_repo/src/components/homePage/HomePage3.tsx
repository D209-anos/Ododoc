import Home3 from '../../css/components/homePage/Home3.module.css'
import EditorErrorPage from '../../assets/images/homePageImage/editorErrorpage.png'
import ErrorScreen from '../../assets/images/homePageImage/errorScreen.png'
import SuccessScreen from '../../assets/images/homePageImage/successScreen.png'
import NextVector from '../../assets/images/mark/nextVector.png'

interface HomePage3Props {
    backgroundColor: string;
    opacity: number;
    textColor: string;
}

function HomePage3 (props: HomePage3Props) {
    return (
        <section className={Home3.container}>
            <div className={Home3.textArea}>
                <p className={`${Home3.bmjuaFont} ${Home3.heading}`}>어떤 코드로 성공 실패했는지 한눈에</p>
                <p className={`${Home3.hanbitFont} ${Home3.subheading}`}>모든 트러블 슈팅 코드를 확인할 수 있어요.</p>
            </div>
            <div className={Home3.splitContainer}>
                <div className={Home3.leftHalf}>
                    <img src={ErrorScreen} alt="error-screen" className={Home3.ErrorScreen}/>
                    <img src={SuccessScreen} alt="success-screen" className={Home3.SuccessScreen}/>
                </div>
                <div className={Home3.rightHalf}>
                    <img src={EditorErrorPage} alt="editor-error-page" className={Home3.EditorErrorPage} />
                </div>
            </div>
            <img src={NextVector} alt="next-vector" className={Home3.NextVector} />
        </section>
    )
}

export default HomePage3
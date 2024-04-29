import BlackLogoMark from "../../assets/images/ododocLogo/ododoc-black.png"
import Home1 from "../../css/components/homePage/Home1.module.css"
import MainLogo from "../../assets/images/ododocLogo/mainLogo.png"
import { ReactTyped } from "react-typed";

interface HomePage1Props {
    backgroundColor: string;
    opacity: number;
    textColor: string;
}

function HomePage1(props: HomePage1Props) {
    return (
        <>
            {/* logo */}
            <header className={Home1.nav} style={{ background: props.backgroundColor }}>
                <img src={BlackLogoMark} alt="black-logo-mark" className={Home1.logo} />
            </header>
            <section className={Home1.start1} style={{
                background: props.backgroundColor,
            }}>

                <div className={Home1.main}>
                    {/* ododoc 시그니처 이미지 */}
                    <div className={Home1.mainImg}>
                        <img src={MainLogo} alt="black-logo-mark" className={Home1.mainlogoPosition} />
                    </div>
                    <div className={`${Home1.bmjuaFont} ${Home1.mainText} ${Home1.fontWhiteColor}`}>
                        {/* 타이핑 애니메이션 */}
                        <ReactTyped
                            strings={['번거롭게 정리에 시간쓰지 마세요', '개발과 정리를 한 번에 해보세요', '개발기록과 검색결과를 요약해드립니다', '에디터로 직접 문서 정리 가능해요', '여러분은 개발에 더 집중하세요']}
                            typeSpeed={40}
                            backSpeed={25}
                            loop
                            shuffle
                        />
                    </div>
                </div>
                <div className={Home1.textWrapper}>
                    <div className={`${Home1.bmjuaFont} ${Home1.text}`} style={{ color: props.textColor }}>
                        <span className={Home1.textTitle}>
                            <p>개발과 정리를 한 번에</p>
                        </span>
                        <span className={Home1.textContent}>
                            개발 과정 기록은 저희에게 맡기고 개발에만 집중하세요 <br />
                            검색결과, 작성코드, 오류정보를 정확히 추출해 드립니다 <br />
                            기록과정이 번거로웠던 당신을 위한 서비스 <br />
                            개발도 문서 정리도, 이제는 한 번에 해결하세요
                        </span>
                    </div>
                </div>
            </section>
        </>
    )
}

export default HomePage1
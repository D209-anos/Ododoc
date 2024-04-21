import { useState } from 'react';
import Logo from '../assets/images/ododoc-start.png'
import start from '../css/view/Start.module.css';
import VSCode from '../components/start/VSCode';
import IntelliJ from '../components/start/IntelliJ';
import Chrome from '../components/start/Chrome';

// selected의 타입을 명시적으로 선언합니다.
type SelectedType = 'VSCode' | 'IntelliJ' | 'Chrome' | null;

function Start() {
    const [selected, setSelected] = useState<SelectedType>(null);  // 현재 선택된 항목을 관리하는 state

    // 선택된 컴포넌트를 렌더링하는 함수
    function renderComponent() {
        switch (selected) {
            case 'VSCode':
                return <VSCode />;
            case 'IntelliJ':
                return <IntelliJ />;
            case 'Chrome':
                return <Chrome />;
            default:
                return <VSCode/>;
        }
    }

    return (
        <div className={start.container}>
            <header className={start.header}>
                <img src={Logo} alt="logo" className={start.logo} />
                <div className={start.list}>
                    <ul>
                        <li onClick={() => setSelected('VSCode')}>VSCode</li>
                        <li onClick={() => setSelected('IntelliJ')}>IntelliJ</li>
                        <li onClick={() => setSelected('Chrome')}>Chrome</li>
                    </ul>
                </div>
            </header>
            <div className={start.right}>
                {renderComponent()}
            </div>
        </div>
    );
}

export default Start;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Logo from '../assets/images/ododocLogo/ododoc-start.png';
import start from '../css/view/startPage/Start.module.css';
import VSCode from '../components/startPage/VSCode';
import IntelliJ from '../components/startPage/IntelliJ';
import Chrome from '../components/startPage/Chrome';

type SelectedType = 'VSCode' | 'IntelliJ' | 'Chrome';

function validateSelectedType(type: string | undefined): SelectedType | null {
  const validTypes: SelectedType[] = ['VSCode', 'IntelliJ', 'Chrome'];
  return validTypes.find(v => v.toLowerCase() === type?.toLowerCase()) || null;
}

function Start() {
    const { selectedType } = useParams<{ selectedType?: string }>();
    const [selected, setSelected] = useState<SelectedType | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const validatedType = validateSelectedType(selectedType);
        if (validatedType) {
            setSelected(validatedType);
        } else {
            setSelected('VSCode'); // Default to VSCode if type is invalid
        }
    }, [selectedType]);

    function handleSelect(type: SelectedType) {
        if (type !== selected) {
            setSelected(type);
            navigate(`/start/${type.toLowerCase()}`);
        }
    }

    const componentMap: { [key in SelectedType]: JSX.Element } = {
        VSCode: <VSCode />,
        IntelliJ: <IntelliJ />,
        Chrome: <Chrome />
    };

    function renderComponent() {
        return selected ? componentMap[selected] : <VSCode />;
    }

    return (
        <div className={start.container}>
            <header className={start.header}>
                <img src={Logo} alt="logo" className={start.logo} />
                <div className={start.list}>
                    <ul>
                        <li onClick={() => handleSelect('VSCode')}>VSCode</li>
                        <li onClick={() => handleSelect('IntelliJ')}>IntelliJ</li>
                        <li onClick={() => handleSelect('Chrome')}>Chrome</li>
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

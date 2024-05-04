import { useState } from 'react';

interface ContextWMenuState {
    visible: boolean;
    x: number;
    y: number;
}

const useContextMenu = () => {
    const [menuState, setMenuState] = useState<ContextWMenuState>({ visible: false, x:0, y:0 });

    const showMenu = (x: number, y: number) => {
        setMenuState({
            visible: true,
            x,
            y
        });
    };

    const hideMenu = () => {
        setMenuState(prev => ({ ...prev, visible: false }));
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>, id: number): void => {
        event.preventDefault();
        showMenu(event.clientX, event.clientY);
    };
    
    return {
        menuState,
        handleContextMenu,
        hideMenu
    }
}

export default useContextMenu;
import { useState } from 'react';

interface ContextWMenuState {
    visible: boolean;
    x: number;
    y: number;
    id: number;
}

const useContextMenu = () => {
    const [menuState, setMenuState] = useState<ContextWMenuState>({ visible: false, x:0, y:0, id:0});

    const showMenu = (x: number, y: number, id: number) => {
        // console.log(id)
        setMenuState({
            visible: true,
            x,
            y,
            id
        });
    };

    const hideMenu = () => {
        setMenuState(prev => ({ ...prev, visible: false }));
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>, id: number): void => {
        event.preventDefault();
        event.stopPropagation();
        showMenu(event.clientX, event.clientY, id);
    };
    
    return {
        menuState,
        handleContextMenu,
        hideMenu
    }
}

export default useContextMenu;
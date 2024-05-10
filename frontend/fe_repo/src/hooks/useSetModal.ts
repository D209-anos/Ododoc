import { useEffect } from 'react';

const useSetModal = (isOpen: boolean, effectiveRef: React.RefObject<HTMLImageElement>, setModalStyle: React.Dispatch<React.SetStateAction<React.CSSProperties>>) => {
    useEffect(() => {
        if (isOpen && effectiveRef.current) {
            const imgRect = effectiveRef.current.getBoundingClientRect();
            const scrollOffset = window.pageYOffset || document.documentElement.scrollTop;
            setModalStyle({
                position: 'absolute',
                top: `${imgRect.top + scrollOffset}px`,
                left: `${imgRect.right + 10}px`,
            });
        }
    }, [isOpen, effectiveRef, setModalStyle]);
}

export default useSetModal;
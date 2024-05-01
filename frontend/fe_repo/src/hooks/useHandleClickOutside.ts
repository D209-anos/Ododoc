import { useEffect } from 'react';

// 모달창 바깥 클릭 시 모달창 닫히는 로직
function useHandleClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T>,
    callback: () => void
): void {
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, callback]);
}

export default useHandleClickOutside;
import { useRef, useState, RefObject } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver';

interface UseVisibilityProps {
    ref: RefObject<HTMLElement>;
    threshold?: number;
}

const useVisibility = ({ ref, threshold = 0.4 }: UseVisibilityProps): boolean => {
    const [isVisible, setIsVisible] = useState(false);

    useIntersectionObserver({
        ref,
        onIntersect: () => setIsVisible(true),
        onExit: () => setIsVisible(false),
        threshold
    });

    return isVisible;
};

export default useVisibility;

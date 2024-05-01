import { RefObject, useEffect } from 'react';

interface UseIntersectionObserverProps {
  ref: RefObject<HTMLElement>;
  onIntersect: () => void;
  onExit: () => void;
  threshold?: number | number[];
}

export const useIntersectionObserver = ({
  ref,
  onIntersect,
  onExit,
  threshold = 0.1,
}: UseIntersectionObserverProps) => {
  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          } else {
            onExit();
          }
        });
      },
      { threshold }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [ref, onIntersect, onExit, threshold]);
};
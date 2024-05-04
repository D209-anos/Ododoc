import { RefObject } from 'react';

interface useOpacityAnimationProps {
    isVisibleRef: RefObject<boolean>;
    startDelay: number;
}

const useOpacityAnimation = ({ isVisibleRef, startDelay }: useOpacityAnimationProps) => {
  const animate = (element: HTMLElement, delay: number): Promise<void> => {
    return new Promise(resolve => {
      setTimeout(() => {
        if (!isVisibleRef.current) return;
        element.style.opacity = '1';
        element.style.transition = 'opacity 0.5s ease-in-out';
        setTimeout(() => {
          if (!isVisibleRef.current) return;
          element.style.opacity = '0.3';
          resolve();
        }, 1000);
      }, delay);
    });
  };

  const resetAndAnimate = async (elements: RefObject<HTMLElement>[]) => {
    while (isVisibleRef.current) {
      for (const el of elements) {
        if (!isVisibleRef.current || !el.current) return;
        await animate(el.current, 1000);
      }
    }
  };

  return { resetAndAnimate };
};

export default useOpacityAnimation;

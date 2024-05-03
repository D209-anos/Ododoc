import { useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

interface UseScrollTriggerProps {
  setText: (text: string) => void;
  setTypingCompleted: (completed: boolean) => void;
  fullText: string;
  textLength: number;
  elementRef: React.RefObject<HTMLElement>;
}

export const useScrollTrigger = ({
  setText,
  setTypingCompleted,
  fullText,
  textLength,
  elementRef
}: UseScrollTriggerProps) => {
  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    if (elementRef.current) {
      const scrollTween = gsap.to({}, {
        scrollTrigger: {
          trigger: elementRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          anticipatePin: 1,
          onLeave: () => {
            setText(fullText);
            setTypingCompleted(true);
          },
          onUpdate: (self) => {
            const scrollProgress = self.progress;
            const maxCharIndex = Math.floor(scrollProgress * textLength);
            setText(fullText.substring(0, maxCharIndex));
            if (maxCharIndex >= textLength - 1) {
              setTypingCompleted(true);
            }
          },
          onEnterBack: () => {
            setText('');
            setTypingCompleted(false);
          },
          markers: false,
        }
      });

      return () => {
        scrollTween.kill();
      }
    }
  }, [elementRef, fullText, setText, setTypingCompleted, textLength]);
}

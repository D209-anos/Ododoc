import { useEffect } from 'react';

interface UseCarouselEffectProps {
  angle: number;
  setTranslateZ: (value: number) => void;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseUp: (event: MouseEvent) => void;
}

const useCarouselEffect = ({
  angle,
  setTranslateZ,
  handleMouseDown,
  handleMouseUp
}: UseCarouselEffectProps) => {
  useEffect(() => {
    const ratateAngle = 360 / 3;  // 아이템 수에 따른 각도 조정 필요
    const radian = (ratateAngle / 2) * Math.PI / 180;
    const tz = Math.round((800 / 2) / Math.tan(radian));
    setTranslateZ(tz);

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [angle, setTranslateZ, handleMouseDown, handleMouseUp]);

  return null;  // 이 훅은 UI를 렌더링하지 않으므로 null 반환
}

export default useCarouselEffect;
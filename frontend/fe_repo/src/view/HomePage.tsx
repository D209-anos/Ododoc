import { useScrollAnimation } from '../hooks/useScrollAnimation';
import HomePage1 from '../components/homePage/HomePage1';
import HomePage2 from '../components/homePage/HomePage2';
import HomePage3 from '../components/homePage/HomePage3';
import HomePage4 from '../components/homePage/HomePage4';
import HomePage5 from '../components/homePage/HomePage5';
import HomePage6 from '../components/homePage/HomePage6';

function HomePage() {
  const { backgroundColor, opacity, textColor } = useScrollAnimation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <HomePage1 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor} />
      <HomePage2></HomePage2>
      <HomePage3 backgroundColor={backgroundColor} opacity={opacity} textColor={textColor}></HomePage3>
      <HomePage4></HomePage4>
      <HomePage5></HomePage5>
      <HomePage6></HomePage6>
    </div>
  )
}


export default HomePage;
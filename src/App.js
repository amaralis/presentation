import { useEffect } from 'react';
import startSolarSystem from './starSystem';
import './style.css';

function App() {
  useEffect(() => {
    startSolarSystem();    
  })


  return (
    <div/>
  );
}

export default App;

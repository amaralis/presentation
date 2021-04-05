import { useEffect } from 'react';
import './App.css';
import startSolarSystem from './starSystem';

function App() {
  useEffect(() => {
    startSolarSystem();    
  })


  return (
    <div/>
  );
}

export default App;

import { useState, useEffect } from 'react';
import './App.css';

function App(){
  const [message, setMessage] = useState(' ');

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
    .then(response => response.json())
    .then(data => setMessage(data.message))
    .catch(error => console.log('Error fetching data:', error));
  }, []);


  return (
    <div>
      <h1>Steam Stats Tracker</h1>
      <p>Message from backend: {message}</p>
    </div>
  );
}


export default App

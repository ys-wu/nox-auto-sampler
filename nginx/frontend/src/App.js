import logo from './logo.svg';
import './App.css';

import { useEffect } from 'react'


function App() {
  useEffect(() => {
    // const hostname = window.location.hostname;
    // const url = `http://${hostname}/series/
    // fetch(url)
    //   .then(res => res.json())
    //   .then(console.log)
    //   .catch(console.error);

    const hostname = window.location.hostname;
    const url = `http://${hostname}/series/`
    fetch(url, {
        method: "POST",
        headers: {
          'Accept': 'application/json, text/plain',
          'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
          "name": "yusheng"
        })
        // body: {"name": "yusheng"}
      })
      .then(res => res.json())
      .then(console.log)
      .catch(console.error);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

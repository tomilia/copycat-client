import React, { useState, useEffect } from "react";
import fetch from "node-fetch";

const App = () => {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }
  async function handleKeyPress (e){
    
    if (e.code === "Enter") {

      const data = new URLSearchParams();
      data.append('word', e.target.value);
      console.log(data);
      const response = await fetch("https://localhost:7067/Copy?word="+e.target.value,{
        method: "POST",
      })
      .then((response) => {
        if(response.status == 200){
          fetchWords();
        }
      })
      .catch((error) => {
        console.log(error)
      });
    }
  };
  const fetchWords = async () => {
    const response = await fetch("https://localhost:7067/Copy");
    console.log(response)
    const data = await response.json();
    setWords(data);
  };

  useEffect(() => {
    fetchWords();
  }, []);

  return (
    <div>
      <h1>All Words</h1>
      {words.map((word) => (
        <li key={word}>{word}</li>
      ))}
      <input
        type="text"
        id="input-field"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
    </div>
    
  );
};

export default App;
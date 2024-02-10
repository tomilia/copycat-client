import React, { useState, useEffect } from "react";
import fetch from "node-fetch";

const App = () => {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const response = await fetch('http://58.176.223.95:5277/Copy/Upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert('File uploaded successfully');
          window.location.reload();
        } else {
          alert('Error uploading file');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
  const handleDownload = (fileName) => {
    fetch(`http://58.176.223.95:5277/Copy/File/${fileName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error downloading file');
        }
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
        console.log(url);
        console.log(blob);

        // Create a temporary link element and click it to initiate the file download
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        // Clean up the temporary link element
        URL.revokeObjectURL(url);
      })
      .catch(error => console.error('Error:', error));
  };
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  }
  async function handleKeyPress (e){
    
    if (e.code === "Enter") {

      const data = new URLSearchParams();
      data.append('word', e.target.value);
      console.log(data);
      const response = await fetch("http://58.176.223.95:5277/Copy/AddWord?word="+e.target.value,{
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
    const response = await fetch("http://58.176.223.95:5277/Copy/GetAllWordsOrderByTime");
    console.log(response)
    const data = await response.json();
    setWords(data);
  };
  const fetchFiles = async () => {
    fetch('http://58.176.223.95:5277/Copy/GetFiles')
    .then(response => response.json())
    .then(data => setFiles(data))
    .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchWords();
    fetchFiles();
  }, []);

  return (
    <div style={{margin: 10}}>
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
      <hr></hr>
      <h5>
        File Upload:
      </h5>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>
      <hr></hr>
      <h5>File Download</h5>
      <ul>
        {files.map((file, index) => (
          <li key={index} onClick={() => handleDownload(file)} style={{marginTop: 10}}>
            {file}
          </li>
          
        ))}
      </ul>
    </div>
    
  );
};

export default App;
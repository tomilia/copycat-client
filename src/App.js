import React, { useState, useEffect } from "react";
import { Col, Row, Container } from 'react-bootstrap';
import fetch from "node-fetch";
import 'bootstrap/dist/css/bootstrap.min.css';

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
        const response = await fetch('http://63.250.41.222:5277/Copy/Upload', {
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
    fetch(`http://63.250.41.222:5277/Copy/File/${fileName}`)
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
  const handleDelete = (fileName) => {
    fetch(`http://63.250.41.222:5277/Copy/File/Delete/${fileName}`, {
      method: 'POST'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error delete file');
        }
        alert("File Delete Successfully");
        window.location.reload();
      });
  }

  async function handleKeyPress(e) {

    if (e.code === "Enter") {

      const data = new URLSearchParams();
      data.append('word', e.target.value);
      console.log(data);
      const response = await fetch("http://63.250.41.222:5277/Copy/AddWord?word=" + e.target.value, {
        method: "POST",
      })
        .then((response) => {
          if (response.status == 200) {
            fetchWords();
          }
        })
        .catch((error) => {
          console.log(error)
        });
    }
  };
  const fetchWords = async () => {
    const response = await fetch("http://63.250.41.222:5277/Copy/GetAllWordsOrderByTime");
    console.log(response)
    const data = await response.json();
    setWords(data);
  };
  const fetchFiles = async () => {
    fetch('http://63.250.41.222:5277/Copy/GetFiles')
      .then(response => response.json())
      .then(data => setFiles(data))
      .catch(error => console.error('Error:', error));
  };

  useEffect(() => {
    fetchWords();
    fetchFiles();
  }, []);

  return (
    <Container fluid>
      <div style={{ margin: 10 }}>
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

        <Row>
          {files.map((file, index) => (
            <Col key={index}>
              <div>
                <img src={`data:image/jpeg;base64,${file.preview}`} alt="Preview" />
                <h4>{file.name.split(".")[0]}</h4>
                <button onClick={() => handleDownload(file.name)}>Download</button>
                <button onClick={() => handleDelete(file.name)}>Delete</button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </Container>

  );
};

export default App;
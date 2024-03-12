import React, { useState, useEffect } from "react";
import { Col, Row, Container, Modal, Spinner } from 'react-bootstrap';
import fetch from "node-fetch";
import config from './config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Toast from 'react-bootstrap/Toast';

const App = () => {
  const [words, setWords] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      setIsUploading(true);
      try {
        const response = await fetch(`${config.uploadApi}`, {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          alert("File Delete Successfully");
        } else {
          setErrorMessage('Error uploading file');
          setShowError(true);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsUploading(false);
        window.location.reload();
      }

    }
  }
  const handleDownload = (fileName) => {
    fetch(`${config.downloadApi}/${fileName}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error downloading file');
        }
        return response.blob();
      })
      .then(blob => {
        const url = URL.createObjectURL(blob);
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
    fetch(`${config.deleteApi}/${fileName}`, {
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

  async function handleEnterWord(e) {
    if (e.code === "Enter" || e.type === "click") {

      const data = new URLSearchParams();
      data.append('word', inputValue);
      const response = await fetch(`${config.addWordApi}?word=` + inputValue, {
        method: "POST",
      })
        .then((response) => {
          if (response.status == 200) {
            fetchWords();
          }
        })
        .catch((error) => {
          setErrorMessage(error.toString());
          setShowError(true);
        });
    }
  };
  const fetchWords = async () => {
    try {
      const response = await fetch(`${config.listWordApi}`);
      const data = await response.json();
      setWords(data);
    } catch (e) {
      setErrorMessage(e.toString());
      setShowError(true);
    }
  };
  const fetchFiles = async () => {
    fetch(`${config.listFileApi}`)
      .then(response => response.json())
      .then(data => setFiles(data))
      .catch(error => {
        setErrorMessage(error.toString());
        setShowError(true);
      });
  };

  const handleErrorPromptClose = () => {
    setShowError(false);
  };

  useEffect(() => {
    fetchWords();
    fetchFiles();
  }, []);

  return (
    <Container fluid>
      <div style={{ margin: 10 }}>
        <div className="toast-container">
          <Toast show={showError} onClose={handleErrorPromptClose} className="toast" delay={6000} autohide>
            <Toast.Header closeButton={false}>
              <strong className="mr-auto" class="toast-word">Error</strong>
            </Toast.Header>
            <Toast.Body class="toast-word">{errorMessage}</Toast.Body>
          </Toast>
        </div>
        <h1>UpHub</h1>

        <div class="input-group mb-1 w-50">
          <input
            type="text"
            id="input-field"
            value={inputValue}
            className="form-control"
            onChange={handleInputChange}
            onKeyDown={handleEnterWord}
          />
          <div class="input-group-append">
            <button type="button" class="btn btn-primary" name="wordsAddButton" onClick={handleEnterWord}>Add Word</button>
          </div>
        </div>
        {words.map((word) => {
          return (
            <div
              key={word}
              className=" p-1 my-1 border border-gray-200 flex items-center"
            >
              <label>

              </label>

              <span className="ml-4">{word}</span>
            </div>
          );
        })}

        <hr></hr>
        <h5>
          File Upload:
        </h5>
        <div class="dropzone">
          <img src="http://100dayscss.com/codepen/upload.svg" class="upload-icon" />
          <input type="file" class="upload-input" onChange={handleFileChange} />
        </div>
        <hr></hr>
        <button type="button" class="btn btn-success" name="uploadbutton" onClick={handleFileUpload}>Upload file</button>
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

        <Modal show={isUploading} onHide={() => { }}>
          <Modal.Body>
            {isUploading ? (
              <div className="text-center">
                <Spinner animation="grow" variant="danger"  />
                <p>Uploading file...</p>
                <i>Sponsored by...Mr.Balltsz</i>
                <img class="w-100" src={require('./images/frenchie-balltsz.png')}></img>
              </div>
            ) : (
              <p>File upload complete!</p>
            )}
          </Modal.Body>
        </Modal>
      </div>
    </Container>

  );
};

export default App;
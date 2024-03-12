const apiBase = process.env.REACT_APP_API_ENDPOINT;
const config = {
    uploadApi : `${apiBase}/Copy/Upload`,
    downloadApi : `${apiBase}/Copy/File`,
    addWordApi : `${apiBase}/Copy/AddWord`,
    deleteApi : `${apiBase}/Copy/File/Delete`,
    listWordApi : `${apiBase}/Copy/GetAllWordsOrderByTime`,
    listFileApi : `${apiBase}/Copy/GetFiles`,

  };
  
  export default config;
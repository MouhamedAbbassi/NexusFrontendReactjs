// FacialRecognitionComponent.jsx

import React, { useState } from 'react';
import axios from 'axios';

const FacialRecognition = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const recognizeFace = async () => {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await axios.post('http://localhost:3000/recognize-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      console.error('Error recognizing face:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={recognizeFace}>Recognize Face</button>
      {result && <p>Result: {result}</p>}
    </div>
  );
};

export default FacialRecognition;

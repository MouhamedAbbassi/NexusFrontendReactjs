import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Input,
  Select,
  Button,
} from "@material-tailwind/react";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

function RessourceForm() {
  const [resourceType, setResourceType] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleResourceTypeChange = (e) => {
    setResourceType(e.target.value);
    setFile(null);
    setUrl('');
    setPreviewUrl('');
    setPreviewImage(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    const selectedFile = e.target.files[0];
    if (selectedFile.type.startsWith('video/')) {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    } else if (selectedFile.type === 'application/pdf') {
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let formData = new FormData();
      if (resourceType === 'file' && file) {
        formData.append('file', file);
        await axios.post('http://localhost:3000/ressources/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (resourceType === 'link' && url) {
        await axios.post('http://localhost:3000/ressources/link', { link: url });
      } else {
        throw new Error('Please select a file or enter a URL.');
      }

      alert('Resource added successfully!');
      setFile(null);
      setUrl('');
      setPreviewUrl('');
      setPreviewImage(null);
    } catch (error) {
      console.error('Error adding resource:', error);
      setErrorMessage(error.message);
    }
  };

  return (
    <Card>
      <CardBody>
        <h2>Add Resource</h2>
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <label className="mr-2">Resource Type:</label>
            <Select value={resourceType} onChange={handleResourceTypeChange}>
            <option value="file" onClick={() => setResourceType('file')}>Upload File</option>
  <option value="link" onClick={() => setResourceType('link')}>Add URL</option>
            </Select>
          </div>
          {resourceType === 'file' && (
            <div className="mb-4">
              <label className="mr-2">File:</label>
              <Input type="file" onChange={handleFileChange} />
            </div>
          )}
          {resourceType === 'link' && (
            <div className="mb-4">
              <label className="mr-2">URL:</label>
              <Input type="text" value={url} onChange={handleUrlChange} />
            </div>
          )}
          {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
          {previewUrl && (
            <div>
              {previewUrl.endsWith('.pdf') ? (
                <Document file={previewUrl}>
                  <Page pageNumber={1} />
                </Document>
              ) : (
                <video controls width="300">
                  <source src={previewUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          )}
          <div className="flex justify-between">
            <Link to="/dashboard/ressources">
              <Button color="indigo">Cancel</Button>
            </Link>
            <Button color="indigo" type="submit">Add Resource</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}

export default RessourceForm;

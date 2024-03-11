import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  Input,
  Select,
  Button,
} from "@material-tailwind/react";
function ResourceEditForm() {
  const [resource, setResource] = useState({});
  const [resourceType, setResourceType] = useState('file');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); // Ajout de l'état de chargement
  const { id } = useParams();

  useEffect(() => {
    const fetchResource = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/ressources/${id}`);
        const { data } = response;
        setResource(data);
        setFileName(data.fileName);
        setUrl(data.url);
        setResourceType(data.type);
      } catch (error) {
        console.error('Error fetching resource details:', error);
        setErrorMessage('Error fetching resource details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  const handleResourceTypeChange = (e) => {
    setResourceType(e.target.value);
    setFile(null);
    setUrl('');
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name); // Mettez à jour le nom du fichier
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let formData = new FormData();
      if (resourceType === 'file' && file) {
        formData.append('file', file);
        await axios.put(`http://localhost:3000/ressources/upload/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (resourceType === 'link' && url) {
        await axios.put(`http://localhost:3000/ressources/link/${id}`, { link: url });

      } else {
        throw new Error('Please select a file or enter a URL.');
      }

      alert('Resource updated successfully!');
      setFile(null);
      setUrl('');
      setExpirationDate('');
    } catch (error) {
      console.error('Error updating resource:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardBody>
        <h2>Edit Resource</h2>
        {errorMessage && <p>{errorMessage}</p>}
        {loading && <p>Loading...</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex items-center mb-4">
            <label className="mr-2">Resource Type:</label>
            <Select value={resourceType} onChange={handleResourceTypeChange}>
  <option value="file" onClick={() => setResourceType('file')}>Upload File</option>
  <option value="link" onClick={() => setResourceType('link')}>Add URL</option>
</Select>

          </div>
          <div className="mb-4">
            <label className="mr-2">File:</label>
            {/* Affichez le champ de téléchargement de fichier uniquement si le type de ressource est "file" */}
            {resourceType === 'file' && <Input type="file" accept=".pdf,.mp4,.gif,image/*" onChange={handleFileChange} />}
            {resourceType === 'file' && fileName && <p>Current File: {fileName}</p>}
          </div>
          <div className="mb-4">
            <label className="mr-2">URL:</label>
            {/* Affichez le champ d'URL uniquement si le type de ressource est "link" */}
            {resourceType === 'link' && <Input type="text" value={url} onChange={handleUrlChange} />}
          </div>
          <Button color="indigo" type="submit">Update Resource</Button>
        </form>
      </CardBody>
    </Card>
  );
}

export default ResourceEditForm;

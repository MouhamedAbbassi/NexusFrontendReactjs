// ResourceEditForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

function ResourceEditForm(props) {
  const { id, updateResourceList } = props;

  const [resource, setResource] = useState({});
  const [resourceType, setResourceType] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [fileName, setFileName] = useState('');

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
    setPreviewUrl('');
    setPreviewImage(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
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

      setSnackbarOpen(true);

      // Mettez à jour la liste des ressources après la modification
      updateResourceList();
    } catch (error) {
      console.error('Error updating resource:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>Edit Resource</Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="resource-type-label">Resource Type</InputLabel>
                <Select
                  labelId="resource-type-label"
                  value={resourceType}
                  onChange={handleResourceTypeChange}
                >
                  <MenuItem value="file">Upload File</MenuItem>
                  <MenuItem value="link">Add URL</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {resourceType === 'file' && (
              <Grid item xs={12}>
                <input
                  accept="image/*, video/*, application/pdf"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button variant="contained" component="span">
                    Choose File
                  </Button>
                </label>
                {file ? (
                  <Typography variant="body2">{file.name}</Typography>
                ) : (
                  <Typography variant="body2" className={resource.isModified ? 'modified-resource' : ''}>{resource.fileName}</Typography>
                )}
              </Grid>
            )}

            {resourceType === 'link' && (
              <Grid item xs={12}>
                <TextField
                  label="URL"
                  fullWidth
                  value={url}
                  onChange={handleUrlChange}
                  error={!!errorMessage}
                  helperText={errorMessage}
                />
              </Grid>
            )}
            {loading && (
              <Grid item xs={12}>
                <CircularProgress />
              </Grid>
            )}
            {previewUrl && (
              <Grid item xs={12}>
                {previewUrl.endsWith('.pdf') ? (
                  <Document file={previewUrl}>
                    <Page pageNumber={1} />
                  </Document>
                ) : (
                  <img src={previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
                )}
              </Grid>
            )}
            <Grid item xs={12}>
              <Button color="primary" type="submit">Update Resource</Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Resource updated successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        ContentProps={{
          style: {
            backgroundColor: 'green',
            color: 'white',
          },
        }}
      />
    </Card>
  );
}

export default ResourceEditForm;

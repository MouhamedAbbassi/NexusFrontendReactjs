import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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

function RessourceForm() {
  const [resourceType, setResourceType] = useState('file');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleResourceTypeChange = (e) => {
    setResourceType(e.target.value);
    setFile(null);
    setUrl('');
    setPreviewUrl('');
    setPreviewImage(null);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('video/') || selectedFile.type === 'application/pdf') {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      }
    }
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
        await axios.post('http://localhost:3000/ressources/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else if (resourceType === 'link' && url) {
        if (!url.startsWith("https://")) {
          throw new Error('The URL must start with "https://".');
        }
        await axios.post('http://localhost:3000/ressources/link', { link: url });
      } else {
        throw new Error('Please select a file or enter a URL.');
      }

      setSnackbarOpen(true);
      setFile(null);
      setUrl('');
      setPreviewUrl('');
      setPreviewImage(null);
    } catch (error) {
      console.error('Error adding resource:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    
    <Card style={{ overflowY: "auto" , scrollbarWidth: "thin"}}>
      <CardContent >
        <Typography variant="h5" gutterBottom>Add Resource</Typography>
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
                {file && <Typography variant="body2">{file.name}</Typography>}
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
            {previewImage && (
              <Grid item xs={12}>
                <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />
              </Grid>
            )}
            {previewUrl && (
              <Grid item xs={12}>
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
              </Grid>
            )}
            <Grid item xs={12}>
              <Button color="secondary" component={Link} to="/dashboard/ressources">Cancel</Button>
              <Button color="primary" type="submit">Add Resource</Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Resource added successfully!"
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

export default RessourceForm;
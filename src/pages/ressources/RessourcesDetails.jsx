import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Card, CardContent, Typography, Link, Button } from '@material-ui/core'; // Assurez-vous d'importer Button depuis @material-ui/core

function RessourceDetails() {
  const { id } = useParams();
  const [ressource, setRessource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRessourceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/ressources/${id}`);
        setRessource(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ressource details:', error);
        setError('Error fetching ressource details');
        setLoading(false);
      }
    };

    fetchRessourceDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!ressource) {
    return <div>No ressource found</div>;
  }

  const filePathParts = ressource.filePath.split('\\');
  const f = filePathParts.slice(2).join('/'); // Extracting the file name without "src/images/"
  console.log("aaaaa" + f);

  return (
    <div>
      <Button component={RouterLink} to="/dashboard/ressources" variant="contained" color="primary" style={{ marginBottom: '20px' }}>
        Retour à la liste des ressources
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Ressource Details
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            ID: {ressource.filePath}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            File Name: {ressource.fileName}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            File Type: {ressource.fileType}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Created At: {new Date(ressource.createdAt).toLocaleString()}
          </Typography>
          {ressource.fileType !== "txt" ? (
            <iframe src={`http://localhost:3000/uploads/${f}`} width="100%" height="500"></iframe>
          ) : (
            <div>
              <Link href={ressource.fileName} target="_blank" rel="noopener noreferrer">
                Go to link
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default RessourceDetails;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {  CardContent, Link, Button, makeStyles } from '@material-ui/core'; 
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Card, CardBody, CardHeader, Typography } from '@material-tailwind/react'; // Import des composants nécessaires depuis Material Tailwind
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  backButton: {
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.primary.main,
  },
  backButtonIcon: {
    marginRight: theme.spacing(1),
    fontSize: 'small', // Définir la taille de l'icône sur petite
  },
  card: {
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(2),
  },
  fileName: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
}));

function RessourceDetails() {
  const classes = useStyles();
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
  const fileName = filePathParts.slice(2).join('/'); 

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 mx-6">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex items-center">
            <ArrowBackIcon style={{ marginRight: '8px', cursor: 'pointer' }} onClick={() => window.history.back()} />
            <Typography variant="h6" color="white">
              Détails de la ressource
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="pt-4">
  <Typography variant="body2" color="textSecondary">
    <span style={{ fontWeight: 'bold' }}>Nom du fichier:</span> {ressource.fileName}
  </Typography>
  <Typography variant="body2" color="textSecondary" gutterBottom>
    <span style={{ fontWeight: 'bold' }}>Type de fichier:</span> {ressource.fileType}
  </Typography>
  <Typography variant="body2" color="textSecondary" gutterBottom>
    <span style={{ fontWeight: 'bold' }}>Date de création:</span> {new Date(ressource.createdAt).toLocaleString()}
  </Typography>
  {ressource.fileType !== "txt" ? (
    <iframe src={`http://localhost:3000/uploads/${fileName}`} width="100%" height="500"></iframe>
  ) : (
    <div>
      <Link
        href={ressource.fileName}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold' }}
      >
        Aller au lien
      </Link>
    </div>
  )}
</CardBody>

      </Card>
    </div>
  );
}

export default RessourceDetails;
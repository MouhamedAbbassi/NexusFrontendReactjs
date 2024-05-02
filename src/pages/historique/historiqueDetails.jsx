// HistoriqueDetails.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Link } from '@material-ui/core';
import { Card, CardBody, CardHeader } from '@material-tailwind/react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function HistoriqueDetails() {
  const { id } = useParams();
  const [historique, setHistorique] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistoriqueDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/historiques/${id}`);
        setHistorique(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historique details:', error);
        setError('Error fetching historique details');
        setLoading(false);
      }
    };

    fetchHistoriqueDetails();
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!historique) {
    return <Typography variant="h6">No historique found</Typography>;
  }

  // Vérification si filePath est défini avant d'utiliser split()
  
  const fileName = historique.filePath ? historique.filePath.split('\\').slice(2).join('/') : '';

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12 mx-6">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex items-center">
            <ArrowBackIcon style={{ marginRight: '8px', cursor: 'pointer' }} onClick={() => window.history.back()} />
            <Typography variant="h6" color="textPrimary">
              Détails de l'historique
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="pt-4">
          <Typography variant="body2" color="textSecondary">
            <span style={{ fontWeight: 'bold' }}>Nom du fichier:</span> {historique.filePath}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <span style={{ fontWeight: 'bold' }}>Type de fichier:</span> {historique.fileType}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            <span style={{ fontWeight: 'bold' }}>Date de création:</span>{' '}
            {new Date(historique.createdAt).toLocaleString()}
          </Typography>
          {historique.fileType !== 'txt' ? (
            <iframe src={`http://localhost:3000/historiques/${id}`} width="100%" height="500"></iframe>
          ) : (
            <div>
              <Link
                href={historique.fileName}
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

export default HistoriqueDetails;
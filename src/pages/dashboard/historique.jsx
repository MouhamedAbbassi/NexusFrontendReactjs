import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import {
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  makeStyles,
  Button,
  Modal,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
  },
  listItem: {
    justifyContent: 'space-between',
  },
  backButton: {
    marginTop: theme.spacing(2),
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

function Historique() {
  const { resourceId } = useParams();
  const classes = useStyles();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHistorique, setSelectedHistorique] = useState(null);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/historiques/byResourceId/${resourceId}`);
        setHistorique(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historique:', error);
        setError('Error fetching historique');
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [resourceId]);

  const handleEditHistorique = (historique) => {
    setSelectedHistorique(historique);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedHistorique(null);
    setIsEditModalOpen(false);
  };

  const updateHistoriqueEntry = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:3000/historiques/${id}`, updatedData);
      console.log('Historique mis à jour:', response.data);
      closeEditModal();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'historique:', error);
    }
  };

  if (loading) {
    return (
      <div className={classes.root}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.root}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  if (historique.length === 0) {
    return (
      <div className={classes.root}>
        <Typography variant="h6">No historique found for this keyword</Typography>
      </div>
    );
  }

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" gutterBottom>
        Historique de la ressource {resourceId}
      </Typography>
      <List>
        {historique.map((item, index) => (
          <div key={index}>
            <ListItem className={classes.listItem}>
              <ListItemText primary={`Créé le: ${new Date(item.createdAt).toLocaleString()}`} />
              {item.modifiedAt && <ListItemText primary={`Modifié le: ${new Date(item.modifiedAt).toLocaleString()}`} />}
              {item.deleteDate && <ListItemText primary={`Supprimé le: ${new Date(item.deleteDate).toLocaleString()}`} />}
              <Button onClick={() => handleEditHistorique(item)}>Details</Button>
            </ListItem>
            {item.previousContent && (
              <div>
                <Typography variant="subtitle1">Contenu précédent:</Typography>
                <iframe src={item.previousContent} alt="Previous Content" className={classes.image} />
              </div>
            )}
            {index < historique.length - 1 && <Divider />}
          </div>
        ))}
      </List>
      <Button
        className={classes.backButton}
        variant="contained"
        color="primary"
        component={Link}
        to="/dashboard/ressources"
      >
        Retour à la liste des ressources
      </Button>
      <Modal
        open={isEditModalOpen}
        onClose={closeEditModal}
        className={classes.modal}
      >
        <div className={classes.modalPaper}>
          <Typography variant="h6" gutterBottom>
            Détails
          </Typography>
          {selectedHistorique && (
            // Remplacez ce composant avec votre formulaire de modification
            <pre>{JSON.stringify(selectedHistorique, null, 2)}</pre>
          )}
        </div>
      </Modal>
    </Paper>
  );
}

export default Historique;

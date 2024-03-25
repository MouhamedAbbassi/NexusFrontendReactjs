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
}));

function Historique() {
  const { resourceId } = useParams();
  const classes = useStyles();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            </ListItem>
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
    </Paper>
  );
}

export default Historique;

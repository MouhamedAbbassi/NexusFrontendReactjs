import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
} from "@material-tailwind/react";
import { MdEdit, MdDelete, MdHistory, MdAdd } from 'react-icons/md';
//nnnnn
function RessourcesList() {
  const [ressources, setRessources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Nombre d'éléments à afficher par page

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/ressources')
      .then(res => {
        setRessources(res.data);
      })
      .catch(err => {
        setError('Une erreur est survenue lors du chargement des ressources.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette ressource?")) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:3000/ressources/${id}`);
        setRessources(prevRessources => prevRessources.filter(ressource => ressource._id !== id));
      } catch (error) {
        setError('Une erreur est survenue lors de la suppression de la ressource.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleHistory = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:3000/historiques/${id}`);
      setHistorique(response.data);
      history.push(`/historique/${id}`); 
     
    } catch (error) {
      setError('Une erreur est survenue lors de la récupération de l\'historique de la ressource.');
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.ceil(ressources.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = ressources.slice(indexOfFirstItem, indexOfLastItem);

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pageCount; i++) {
      pageNumbers.push(
        <Button key={i} onClick={() => setCurrentPage(i)}>
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  const renderContent = (ressource) => {
    switch (ressource.fileType) {
      case 'image':
        return <img src={ressource.content} alt="Image" />;
      case 'video':
        return <video src={ressource.content} controls />;
      case 'pdf':
        return <a href={ressource.content} target="_blank" rel="noopener noreferrer">Voir PDF</a>;
      case 'web':
        return <iframe src={ressource.content} title="Web Page" width="100%" height="400px" />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Link to="/form">
        <Button color="blue" size="lg" rounded={true}>
          <MdAdd /> 
        </Button>
      </Link>
      {error && <p>Erreur: {error}</p>}
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div>
          {currentItems.map(ressource => (
            <Card key={ressource._id} className="mb-4">
              <CardBody>
                <div className="flex items-center justify-between">
                  <Avatar
                    src={ressource.fileType === 'image' ? ressource.content : "/img/file-icon.png"}
                    alt="file"
                    size="xs"
                    variant="rounded"
                    className="rounded-full"
                  />
                  <div className="ml-4 flex-1">
                    <Typography variant="body" color="blue-gray">
                      {ressource.fileType}
                    </Typography>
                    <Typography variant="caption" color="gray">
                      {new Date(ressource.createdAt).toLocaleString()}
                    </Typography>
                    {/* Link to file details and content */}
                    <Link to={`/ressources/${ressource._id}`}>Voir détails et contenu du fichier</Link>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link to={`/edit/${ressource._id}`}>
                      <Button size="lg" color="lightBlue" ripple="light" iconOnly={true} rounded={true}>
                        <MdEdit />
                      </Button>
                    </Link>
                    <Button size="lg" color="red" ripple="light" onClick={() => handleDelete(ressource._id)} iconOnly={true} rounded={true}>
                      <MdDelete />
                    </Button>
                    
                    <Button size="lg" color="indigo" ripple="light" onClick={() => handleHistory(ressource._id)} iconOnly={true} rounded={true}>
                      <MdHistory />
                    </Button>
                  </div>
                </div>
                {/* Render content based on file type */}
                {renderContent(ressource)}
              </CardBody>
            </Card>
          ))}
          <div style={{ marginTop: '20px' }}>
            {renderPagination()}
          </div>
        </div>
      )}
    </div>
  );
}

export default RessourcesList;

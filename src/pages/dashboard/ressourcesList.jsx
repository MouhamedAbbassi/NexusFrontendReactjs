import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';

import { FaFileImage, FaFileVideo, FaFilePdf, FaLink } from 'react-icons/fa';
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Button,
} from "@material-tailwind/react";
import { MdEdit, MdDelete, MdHistory, MdAdd } from 'react-icons/md';
import ResourceEditForm from '../ressources/ResourceEditForm';
import { ButtonSpinner, ChakraProvider } from '@chakra-ui/react';
Modal.setAppElement('#root');

function RessourcesList() {
  const [ressources, setRessources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { id } = useParams();
  const [searchDate, setSearchDate] = useState(''); // Ajoutez l'état de la recherche par date
  const [searchType, setSearchType] = useState(''); // Ajoutez l'état de la recherche par type
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFileType, setSearchFileType] = useState('');
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
  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`http://localhost:3000/ressources/search?key=${searchTerm}&type=${searchFileType}`);
      setSearchResults(response.data);
    } catch (error) {
      setError('An error occurred while searching for resources.');
    } finally {
      setLoading(false);
    }
  };
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

  const openModal = () => {
    setShowModal(true);
    setShowSidebar(false);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowSidebar(true);
  };

  const handleEdit = (id) => {
    setEditingResourceId(id);
    openModal();
  };
 
  const pageCount = Math.ceil(ressources.length / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = searchResults.length > 0 ? searchResults.slice(indexOfFirstItem, indexOfLastItem) : ressources.slice(indexOfFirstItem, indexOfLastItem);

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
        return <FaFileImage className="h-8 w-8 text-blue" />;
      case 'video':
        return <FaFileVideo className="h-8 w-8 text-red" />;
      case 'pdf':
        return <FaFilePdf className="h-8 w-8 text-yellow" />;
      case 'web':
        return <FaLink className="h-8 w-8 text-green" />;
      default:
        return null;
    }
  };
  return (
    <ChakraProvider>
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter search term"
        />
       
        <button type="submit">Search</button>
      </form>


      {showSidebar && (
        <Link to="/form">
          <Button color="blue" size="lg" rounded={true}>
            <MdAdd />
          </Button>
        </Link>
      )}

      {error && <p>Erreur: {error}</p>}
      {loading ? (
        <p>Chargement en cours...</p>
      ) : (
        <div>
          {currentItems.map(ressource => (
            <Card key={ressource._id} className="mb-4">
              <CardBody>
                <div className="flex items-center justify-between">
               {/* <Avatar
  src={renderContent(ressource)}
  size="xs"
  variant="rounded"
  className="rounded-full"
          />*/}
                  <div className="ml-4 flex-1">
                    <Typography variant="body" color="blue-gray">
                      {ressource.fileType}
                    </Typography>
                    <Typography variant="caption" color="gray">
                      {new Date(ressource.createdAt).toLocaleString()}
                    </Typography>
                    <Link to={`/ressources/${ressource._id}`}>
                      Voir détails et contenu du fichier
                    </Link>
                  </div>
                  <div className="flex items-center gap-4">
                    
                  <Button size="lg" color="lightBlue" ripple="light" onClick={() => handleEdit(ressource._id)} iconOnly={true} rounded={true}>
  <MdEdit />


                    </Button>
                    <Button size="lg" color="red" ripple="light" onClick={() => handleDelete(ressource._id)} iconOnly={true} rounded={true}>

                    <MdDelete />
                    </Button>
                    <Link to={`/historiques/${ressource._id}`}>
                    <Button size="lg" color="indigo" ripple="light" onClick={() => handleHistory(ressource._id)} iconOnly={true} rounded={true}>
                      <MdHistory />
                    </Button>
                    </Link>

                  </div>
                </div>
                {renderContent(ressource)}
              </CardBody>
            </Card>
          ))}
          <div style={{ marginTop: '20px' }}>
            {renderPagination()}
          </div>
        </div>
      )}

<Modal
  isOpen={showModal}
  onRequestClose={closeModal}
  style={{
    content: {
      width: '50%',
      height: '50%',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }
  }}
>
  <ResourceEditForm id={editingResourceId} />

        {/* Ajoutez d'autres éléments de contenu de la fenêtre modale si nécessaire */}
      </Modal>
    </div>
    </ChakraProvider>
  );
}

export default RessourcesList;
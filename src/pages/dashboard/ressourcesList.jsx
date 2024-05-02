import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import Modal from 'react-modal';
import { FaFileImage, FaFileVideo, FaFilePdf, FaLink } from 'react-icons/fa';
import { Card, CardBody, Text, Button, Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";
import { MdEdit, MdDelete, MdHistory, MdAdd } from 'react-icons/md';
import ResourceEditForm from '../ressources/ResourceEditForm';
import { ChakraProvider, AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay, Button as ChakraButton, useDisclosure } from '@chakra-ui/react';
import { FiSearch, FiInfo } from 'react-icons/fi';
import {
  
  CardHeader,
  
  
} from "@material-tailwind/react";

import RessourceForm from '../ressources/RessourceForm';
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
  const { resourceId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showAddResourceModal, setShowAddResourceModal] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:3000/ressources')
      .then(res => {
        const modifiedRessources = res.data.map(ressource => ({
          ...ressource,
          isModified: isRecentlyModified(ressource.modifiedAt)
        }));
        setRessources(modifiedRessources);
      })
      .catch(err => {
        setError('Une erreur est survenue lors du chargement des ressources.');
      })
      .finally(() => setLoading(false));
  }, []);

  const isRecentlyModified = (modifiedAt) => {
    const timeDifference = Date.now() - new Date(modifiedAt).getTime();
    const hoursDifference = timeDifference / (1000 * 3600);
    //console.log('Time difference:', hoursDifference);
    return hoursDifference < 24; // Retourne true si modifié dans les 24 dernières heures, sinon false
  };
  
  

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredResults = ressources.filter(ressource =>
      ressource.fileType.toLowerCase().includes(term)
    );
    setSearchResults(filteredResults);
  };

  const handleDelete = async (id) => {
    setEditingResourceId(id);
    onOpen();
  };

  const confirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/ressources/${editingResourceId}`);
      setRessources(prevRessources => prevRessources.filter(ressource => ressource._id !== editingResourceId));
    } catch (error) {
      setError('Une erreur est survenue lors de la suppression de la ressource.');
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const openAddResourceModal = () => {
    setShowAddResourceModal(true);
  };
  const closeAddResourceModal = () => {
    setShowAddResourceModal(false);
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

  const updateResourceList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/ressources');
      setRessources(response.data);
    } catch (error) {
      setError('Une erreur est survenue lors de la mise à jour de la liste des ressources.');
    }
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
       <div className="mt-12 mb-8 flex flex-col gap-12 mx-6">
      <CardHeader variant="gradient" color="gray" className="mb-1 p-6">
      <Text variant="h4" fontWeight="bold" mb={4}>Liste de Ressources</Text>

</CardHeader>

        <Stack direction="row" spacing={3} align="center">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Rechercher..."
            />
          </InputGroup>
          {showSidebar && (
            <Button colorScheme="gray" size="lg" onClick={openAddResourceModal}>
            <MdAdd />
          </Button>
          )}
        </Stack>

        {error && <Text color="red.500">Erreur: {error}</Text>}
        {loading ? (
          <Text>Chargement en cours...</Text>
        ) : (
          <div>
            {currentItems.map(ressource => (
              <Card key={ressource._id} className={`mb-4 ${ressource.isModified ? 'font-bold' : ''}`}>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="ml-4 flex-1">
                      <Text color="blueGray.500">{ressource.fileType}</Text>
                      <Text color="gray.500">{new Date(ressource.createdAt).toLocaleString()}</Text>
                      <Link to={`/ressources/${ressource._id}`}>
                        <FiInfo color="black" size={20} />
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      <Button colorScheme="gray" onClick={() => handleEdit(ressource._id)}>
                        <MdEdit />
                      </Button>
                      <Button colorScheme="red" onClick={() => handleDelete(ressource._id)}>
                        <MdDelete />
                      </Button>
                      <Link to={`/historiques/${ressource._id}`}>
                        <Button colorScheme="gray">
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

        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Confirmation de suppression
              </AlertDialogHeader>

              <AlertDialogBody>
                Êtes-vous sûr de vouloir supprimer cette ressource?
              </AlertDialogBody>

              <AlertDialogFooter>
                <ChakraButton ref={cancelRef} onClick={onClose}>
                  Annuler
                </ChakraButton>
                <ChakraButton colorScheme="red" onClick={confirmDelete} ml={3}>
                  Supprimer
                </ChakraButton>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
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
 
          <ResourceEditForm id={editingResourceId} updateResourceList={updateResourceList} />
          {/* Ajoutez d'autres éléments de contenu de la fenêtre modale si nécessaire */}
        </Modal>
        <Modal
  isOpen={showAddResourceModal}
  onRequestClose={closeAddResourceModal}
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
<RessourceForm />
</Modal>
      </div>
    </ChakraProvider>
  );
}

export default RessourcesList;
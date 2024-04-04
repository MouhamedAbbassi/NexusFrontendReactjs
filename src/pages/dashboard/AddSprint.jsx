import React, { useState } from 'react';
import axios from 'axios';
import Modal from 'react-modal';



const AddSprint = ({ onSprintAdded }) => {
  const [newSprint, setNewSprint] = useState({
    nom: '',
    startDate: new Date(),
    endDate: new Date(),
    taches: [],
    
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const addSprint = async (e) => {
    e.preventDefault();

    try {
      // Convertir les enums du front-end en lowercase pour correspondre aux enums du back-end
      const formattedTaches = newSprint.taches.map((tache) => ({
        ...tache,
        type: tache.type.toLowerCase(),
        priority: tache.priority.toLowerCase(),
        status: tache.status.toLowerCase(),
        esp: tache.esp,
        asp: tache.asp,

      }));

      const response = await axios.post('http://localhost:3000/sprints/ajouter', {
        nom: newSprint.nom,
        startDate: newSprint.startDate,
        endDate: newSprint.endDate,
        taches: formattedTaches,
        
      });

      const nouveauSprint = response.data.sprint;
      onSprintAdded(nouveauSprint);

      // Réinitialiser le formulaire après l'ajout
      setNewSprint({
        nom: '',
        startDate: new Date(),
        endDate: new Date(),
        taches: [],
        
      });
      closeModal();
      onSprintAdded(nouveauSprint);

    } catch (error) {
      console.error("Erreur lors de l'ajout du sprint", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSprint((prevSprint) => ({ ...prevSprint, [name]: value }));
  };

  const handleTacheInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedTaches = [...newSprint.taches];
    updatedTaches[index][name] = value;
    setNewSprint((prevSprint) => ({ ...prevSprint, taches: updatedTaches }));
  };

  const addTache = () => {
    setNewSprint((prevSprint) => ({
      ...prevSprint,
      taches: [...prevSprint.taches, { name: '', type: '', priority: '', status: '', esp: '',asp: '', }],
    }));
  };

  const modalStyles = {
    content: {
      top: '30%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      maxWidth: '40%', // Adjust the maximum width as needed,
    },
  };


  return (
    <div>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mb-4"
      >
        Add Sprint 
      </button>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Ajouter Sprint"
        style={modalStyles}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Ajouter un nouveau sprint</h2>
        <form onSubmit={addSprint} className="max-w-2xl mx-auto p-4 bg-gray-100 rounded shadow-md">
        <label className="block mb-2">Name :</label>
        <input
          type="text"
          name="nom"
          value={newSprint.nom}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">Start date</label>
        <input
          type="date"
          name="startDate"
          value={newSprint.startDate}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />
        <label className="block mb-2">End date</label>
        <input
          type="date"
          name="endDate"
          value={newSprint.endDate}
          onChange={handleInputChange}
          className="w-full p-2 mb-4 border rounded"
        />

        
        <button type="button" onClick={addTache} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
        <i class="fas fa-tasks"></i> Add Tasks 
        </button><br></br>

        {newSprint.taches.map((tache, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-2">Name Of Tache :</label>
            <input
              type="text"
              name="name"
              value={tache.name}
              onChange={(e) => handleTacheInputChange(index, e)}
              className="w-full p-2 mb-2 border rounded"
            />

            <label>Type de la tâche:</label>
            <select
              name="type"
              value={tache.type}
              onChange={(e) => handleTacheInputChange(index, e)}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="fonctionnelle">Fonctionnelle</option>
              <option value="qualite">Qualité</option>
              <option value="bug">Bug</option>
              <option value="securite">Sécurité</option>
            </select>

            <label>Priorité de la tâche:</label>
            <select
              name="priority"
              value={tache.priority}
              onChange={(e) => handleTacheInputChange(index, e)}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="faible">Faible</option>
              <option value="critique">Critique</option>
              <option value="eleve">Élevé</option>
            </select>

            <label>Status of Tache :</label>
            <select
              name="status"
              value={tache.status}
              onChange={(e) => handleTacheInputChange(index, e)}
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="pret">Prêt</option>
              <option value="encours">En cours</option>
              <option value="enattente">En attente</option>
              <option value="fait">Fait</option>
            </select>
           
  
          <label>ESP de la tâche:</label>
          <input type="number" name="esp" value={tache.esp} onChange={(e) => handleTacheInputChange(index, e)} className="w-full p-2 mb-4 border rounded" />
          <label>ASP de la tâche:</label>
          <input type="number" name="asp" value={tache.asp} onChange={ (e) => handleTacheInputChange(index, e)} className="w-full p-2 mb-4 border rounded" />
          </div>
          
        ))}<br></br>
        
        

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"><i class="fa fa-plus" aria-hidden="true"></i>
          Add
        </button>
        </form>
        <button
          onClick={closeModal}
          className="bg-red-500 text-white px-4 py-2 rounded cursor-pointer mt-4"
        >
          <i class="fa fa-window-close" aria-hidden="true"></i>
        </button>
      </Modal>
    </div>
  );
};

export default AddSprint;

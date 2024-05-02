import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

const UpdateSprint = ({ sprintId, onUpdate }) => {
    const [updateData, setUpdateData] = useState({
        nom: '',
        startDate: '',
        endDate: '',
        taches: [{ name: '', type: '', priority: '', status: '', esp: '', asp: '' }],
        status: '',
        priority: '',
        type: '',
        esp: '',
        asp: '',
    });
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchSprintData = async () => {
            if (sprintId) {
                try {
                    const response = await axios.get(`http://localhost:3000/sprints/getsprintbyid/${sprintId}`);
                    const existingSprint = response.data;
                    setUpdateData(existingSprint);
                } catch (error) {
                    console.error("Error fetching sprint data", error);
                }
            }
        };

        fetchSprintData();
    }, [sprintId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdateData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleTacheInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedTaches = [...updateData.taches];
        updatedTaches[index][name] = value;
        setUpdateData((prevData) => ({ ...prevData, taches: updatedTaches }));
    };

    const validateForm = () => {
        const errors = {};

        if (!updateData.nom.trim()) {
            errors.nom = 'Nom du sprint est requis';
        }

        if (!updateData.startDate) {
            errors.startDate = 'Date de début est requise';
        }

        if (!updateData.endDate) {
            errors.endDate = 'Date de fin est requise';
        } else if (new Date(updateData.endDate) <= new Date(updateData.startDate)) {
            errors.endDate = 'La date de fin doit être postérieure à la date de début';
        }

        const invalidTaches = updateData.taches.some(tache => {
            return !tache.name.trim() || !tache.type || !tache.priority || !tache.status || !tache.esp || !tache.asp;
        });

        if (invalidTaches) {
            errors.taches = 'Veuillez remplir tous les champs des tâches';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await axios.patch(`http://localhost:3000/sprints/update/${sprintId}`, updateData);
            onUpdate();
            closeModal();
        } catch (error) {
            console.error('Error updating sprint:', error);
        }
    };

    const addTache = () => {
        setUpdateData((prevData) => ({
            ...prevData,
            taches: [...prevData.taches, { name: '', type: '', priority: '', status: '', esp: '', asp: '' }],
        }));
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const modalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '30%', 
            maxHeight: '80vh',
            overflowY: 'auto',
        },
    };
    return (
        <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Update Sprint"
        style={modalStyles}
      >
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Update Sprint</h2>
          <form onSubmit={handleUpdate} className="space-y-4">
                <label className="block">Nom du sprint:</label>
                <input
                    type="text"
                    name="nom"
                    value={updateData.nom}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.nom && <p className="text-red-500">{errors.nom}</p>}

                <label className="block">Start Date :</label>
                <input
                    type="date"
                    name="startDate"
                    value={updateData.startDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.startDate && <p className="text-red-500">{errors.startDate}</p>}

                <label className="block">End Date :</label>
                <input
                    type="date"
                    name="endDate"
                    value={updateData.endDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                />
                {errors.endDate && <p className="text-red-500">{errors.endDate}</p>}

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2">Tâches</h3>
                    {updateData.taches.map((tache, index) => (
                        <div key={index} className="space-y-2">
                            <label>Nom de la tâche:</label>
                            <input
                                type="text"
                                name="name"
                                value={tache.name}
                                onChange={(e) => handleTacheInputChange(index, e)}
                                className="w-full p-2 border rounded"
                            />

                            <label>Type de la tâche:</label>
                            <select
                                name="type"
                                value={tache.type}
                                onChange={(e) => handleTacheInputChange(index, e)}
                                className="w-full p-2 border rounded"
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
                                className="w-full p-2 border rounded"
                            >
                                <option value="faible">Faible</option>
                                <option value="critique">Critique</option>
                                <option value="eleve">Élevé</option>
                            </select>

                            <label>Statut de la tâche:</label>
                            <select
                                name="status"
                                value={tache.status}
                                onChange={(e) => handleTacheInputChange(index, e)}
                                className="w-full p-2 border rounded"
                            >
                                <option value="pret">Prêt</option>
                                <option value="encours">En cours</option>
                                <option value="enattente">En attente</option>
                                <option value="fait">Fait</option>
                            </select>
                            <label>ASP de la tâche:</label>
                            <input
                                type="number"
                                name="asp"
                                value={tache.asp}
                                onChange={(e) => handleTacheInputChange(index, e)}
                                className="w-full p-2 border rounded"
                            />

                            <label>ESP de la tâche:</label>
                            <input
                                type="number"
                                name="esp"
                                value={tache.esp}
                                onChange={(e) => handleTacheInputChange(index, e)}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    ))}

                    <button type="button" onClick={addTache} className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
                    <i class="fas fa-tasks"></i> Add Tasks 
                    </button>
                </div>

                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer">
                <i class="fa fa-plus" aria-hidden="true"></i>
                </button>
                </form>
      </div>
    </Modal>
  );
};

export default UpdateSprint;
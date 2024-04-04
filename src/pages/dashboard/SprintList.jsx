import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeleteSprint from './DeleteSprint.jsx';
import UpdateSprint from './UpdateSprint.jsx';
import AddSprint from './AddSprint.jsx'; 
import { Link } from 'react-router-dom';


const SprintList = () => {
  const [sprints, setSprints] = useState([]);
  const [selectedSprintId, setSelectedSprintId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchSprints = async () => {
      try {
        const response = await axios.get('http://localhost:3000/sprints/all');
        setSprints(response.data.sprints);
      } catch (error) {
        console.error('Erreur lors du chargement des sprints', error);
      }
    };

    fetchSprints();
  }, []);

  const handleDelete = async (deletedSprintId) => {
    try {
      await axios.delete(`http://localhost:3000/sprints/${deletedSprintId}`);
      const updatedSprints = sprints.filter((sprint) => sprint._id !== deletedSprintId);
      setSprints(updatedSprints);
    } catch (error) {
      console.error('Erreur lors de la suppression du sprint', error);
    }
  };

  const handleUpdateClick = (sprintId) => {
    setSelectedSprintId(sprintId);
  };

  const handleUpdateComplete = () => {
    setSelectedSprintId(null);
  };

  const handleAddSprintClick = () => {
    setShowAddForm(true);
  };

  const handleAddSprintClose = () => {
    setShowAddForm(false);
  };

  

  return (
    <div>
     
     <button
  onClick={() => handleAddSprintClick()}
  className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer mb-4"
><i class="fa fa-plus" aria-hidden="true"></i>
  Add Sprint
</button>

      {showAddForm && <AddSprint onSprintAdded={() => handleAddSprintClose()} onClose={handleAddSprintClose} />}
      {sprints.map((sprint) => (
        
        <div key={sprint._id} className="border p-4 mb-4 rounded">
          <h2 className="text-2xl font-bold mb-2">{sprint.nom}</h2>
          
          <DeleteSprint sprintId={sprint._id} onDelete={() => handleDelete(sprint._id)} />&nbsp;
          {selectedSprintId === sprint._id ? (
              <UpdateSprint sprintId={sprint._id} onUpdate={handleUpdateComplete} />
            ) : (
              <button onClick={() => handleUpdateClick(sprint._id)}style={{ backgroundColor: 'blue', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}><i class="fa fa-refresh" aria-hidden="true"></i></button>
            
          )}
          <p className="text-gray-700">
            <strong>Début:</strong> {new Date(sprint.startDate).toLocaleDateString()} |{' '}
            <strong>Fin:</strong> {new Date(sprint.endDate).toLocaleDateString()}
          </p>
          <table className="w-full mt-4">
            <thead>
              <tr>
                <th className="border px-4 py-2">Tâches</th>
                <th className="border px-4 py-2">Statut</th>
                <th className="border px-4 py-2">Priorité</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">ASP</th>
                <th className="border px-4 py-2">ESP</th>
              </tr>
            </thead>
            <tbody>
              {sprint.taches.map((task) => (
                <tr key={task._id}>
                  <td className="border px-4 py-2">{task.name}</td>
                  <td className="border px-4 py-2" style={{ backgroundColor: getTaskColor(task.type) }}>{task.type}</td>
                  <td className="border px-4 py-2" style={{ backgroundColor: getTaskStatusColor(task.status) }}>{task.status}</td>
                  <td className="border px-4 py-2" style={{ backgroundColor: getTaskPriorityColor(task.priority) }}>{task.priority}</td>
                  <td className="border px-4 py-2">{task.asp}</td>
                  <td className="border px-4 py-2">{task.esp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};
const getTaskColor = (taskType) => {
    switch (taskType) {
      case 'fonctionnelle':
        return 'orange';
      case 'qualite':
        return 'lightblue';
      case 'bug':
        return 'lightgreen';
      case 'securite':
        return 'lightcoral';
      default:
        return 'white';
    }
  };
  
  const getTaskStatusColor = (taskStatus) => {
    switch (taskStatus) {
      case 'Pret':
        return 'yellow';
      case 'encours':
        return 'green';
      case 'enattente':
        return 'gray';
      case 'fait':
        return 'blue';
      default:
        return 'white';
    }
  };
  
  const getTaskPriorityColor = (taskPriority) => {
    switch (taskPriority) {
      case 'faible':
        return 'lightgray';
      case 'critique':
        return 'red';
      case 'eleve':
        return 'purple';
      default:
        return null;
    }
  };

export default SprintList;

import React, { useState,useEffect } from 'react';
import axios from 'axios';

const AddMeetingForm = ( { onClose, onMeetingAdded } ) => {
  const generateLinkMeet = () => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
  const [meetingData, setMeetingData] = useState({
    summary: '',
     linkMeet :generateLinkMeet(),
    description: '',
    startDateTime: '',
    endDateTime: '',
    attendees: [{ email: '' }],
    sprints: '', // Ajoutez un état pour stocker le sprint sélectionné
  });

  const [sprints, setSprints] = useState([]); // Ajoutez un état pour stocker les sprints récupérés depuis le backend

  useEffect(() => {
    // Fonction pour récupérer tous les sprints depuis le backend
    const fetchSprints = async () => {
      try {
        const response = await axios.get('http://localhost:3000/sprints/all');
        setSprints(response.data.sprints); // Met à jour l'état local avec les sprints récupérés
      } catch (error) {
        console.error('Erreur lors du chargement des sprints', error);
      }
    };

    fetchSprints(); // Appel de la fonction de récupération des sprints au chargement du composant
  }, []);
  

  const handleSprintSelect = (e) => {
    setMeetingData({
      ...meetingData,
      sprints: e.target.value, // Met à jour le sprint sélectionné dans l'état local
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData({
      ...meetingData,
      [name]: value,
    });
  };

  const handleAttendeesChange = (e, index) => {
    const newAttendees = [...meetingData.attendees];
    newAttendees[index] = { email: e.target.value };
    setMeetingData({
      ...meetingData,
      attendees: newAttendees,
    });
  };

  const addAttendee = () => {
    setMeetingData({
      ...meetingData,
      attendees: [...meetingData.attendees, { email: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3000/meet/add', meetingData);
      onMeetingAdded();
    } catch (error) {
      console.error('Error adding meeting:', error);
    }
  };

  

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-8 rounded-md w-[500px]">
        <h2 className="text-2xl font-bold mb-4">Ajouter Meeting</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            <span className="text-gray-700">Summary:</span>
            <input
              type="text"
              name="summary"
              value={meetingData.summary}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700">Description:</span>
            <input
              type="text"
              name="description"
              value={meetingData.description}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700">Start Date and Time:</span>
            <input
              type="datetime-local"
              name="startDateTime"
              value={meetingData.startDateTime}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-700">End Date and Time:</span>
            <input
              type="datetime-local"
              name="endDateTime"
              value={meetingData.endDateTime}
              onChange={handleChange}
              className="form-input mt-1 block w-full"
            />
          </label>

          <label className="block mb-4">
        <span className="text-gray-700">Sprint :</span>
        <select
          name="selectedSprint"
          value={meetingData.sprints}
          onChange={handleSprintSelect}
          className="form-select mt-1 block w-full"
        >
          <option value="">Sélectionner un sprint</option>
          {/* Afficher les options pour chaque sprint */}
          {sprints.map((sprint) => (
            <option key={sprint._id} value={sprint._id}>{sprint.nom}</option>
          ))}
        </select>
      </label>

          <label className="block mb-4">
            <span className="text-gray-700">Attendees:</span>
            {meetingData.attendees.map((attendee, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  value={attendee.email}
                  onChange={(e) => handleAttendeesChange(e, index)}
                  className="form-input mt-1 block w-full"
                />
              </div>
            ))}
            <button type="button" onClick={addAttendee} className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Attendee
            </button>
          </label>
          

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Add Meeting
          </button>
          
        </form>
        <button onClick={onClose} className="mt-4 text-blue-500">
          Annuler
        </button>
      </div>
    </div>
  );
};

export default AddMeetingForm;

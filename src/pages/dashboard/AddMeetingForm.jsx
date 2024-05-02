import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMeetingForm = ({ onClose, onMeetingAdded }) => {
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
    linkMeet: generateLinkMeet(),
    description: '',
    startDateTime: '',
    endDateTime: '',
    attendees: [{ email: '' }],
    sprints: '', // Ajoutez un état pour stocker le sprint sélectionné
  });

  const [sprints, setSprints] = useState([]); // Ajoutez un état pour stocker les sprints récupérés depuis le backend
  const [errors, setErrors] = useState({}); // Ajoutez un état pour les erreurs de validation

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

  const validateForm = () => {
    const errors = {};

    if (!meetingData.summary.trim()) {
      errors.summary = 'Summary is required';
    }
    if (!meetingData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!meetingData.startDateTime) {
      errors.startDateTime = 'Start date and time are required';
    }

    if (!meetingData.endDateTime) {
      errors.endDateTime = 'End date and time are required';
    } else if (meetingData.endDateTime <= meetingData.startDateTime) {
      errors.endDateTime = 'End date and time must be after start date and time';
    }

    const invalidEmails = meetingData.attendees.filter(attendee => !validateEmail(attendee.email));
    if (invalidEmails.length > 0) {
      errors.attendees = 'Invalid email address';
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateEmail = (email) => {
    // Expression régulière pour valider une adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeetingData({
      ...meetingData,
      [name]: value,
    });
  };

  const handleSprintSelect = (e) => {
    setMeetingData({
      ...meetingData,
      sprints: e.target.value, // Met à jour le sprint sélectionné dans l'état local
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

    if (!validateForm()) {
      return;
    }

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
            {errors.summary && <p className="text-red-500">{errors.summary}</p>}
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
             {errors.description && <p className="text-red-500">{errors.description}</p>}
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
            {errors.startDateTime && <p className="text-red-500">{errors.startDateTime}</p>}
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
            {errors.endDateTime && <p className="text-red-500">{errors.endDateTime}</p>}
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
            {errors.attendees && <p className="text-red-500">{errors.attendees}</p>}
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

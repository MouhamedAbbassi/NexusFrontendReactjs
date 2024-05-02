import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Modal from 'react-modal';

const UpdateMeetingForm = ({ onClose, onMeetingUpdated }) => {
  const { id } = useParams();

  const [meetingId, setMeetingId] = useState(id);
  const [meetingData, setMeetingData] = useState({
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    attendees: [{ email: '' }],
    sprints: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchMeetingData();
  }, [meetingId]);

  const fetchMeetingData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/meet/getById/${meetingId}`);
      const meeting = response.data;

      setMeetingData({
        summary: meeting.summary,
        description: meeting.description,
        startDateTime: meeting.startDateTime,
        endDateTime: meeting.endDateTime,
        attendees: meeting.attendees,
        sprints: meeting.sprints
      });
    } catch (error) {
      console.error(`Error fetching meeting with ID ${meetingId}:`, error);
    }
  };

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
    } else if (new Date(meetingData.endDateTime) <= new Date(meetingData.startDateTime)) {
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
      await axios.put(`http://localhost:3000/meet/update/${meetingId}`, meetingData);
      onMeetingUpdated();
      closeModal();
    } catch (error) {
      console.error(`Error updating meeting with ID ${meetingId}:`, error);
    }
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
        maxWidth: '30%', // Adjust the maximum width as needed,
    },
  };


  return (
    <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Update Meeting"
    style={modalStyles}
  >
    <div className="bg-white p-8 rounded-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Update Meeting</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
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

          <label className="block">
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

          <label className="block">
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

          <label className="block">
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

          <label className="block">
            <span className="text-gray-700">Attendees:</span>
            {meetingData.attendees.map((attendee, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={attendee.email}
                  onChange={(e) => handleAttendeesChange(e, index)}
                  className="form-input mt-1 block w-full"
                />
              </div>
            ))}
            {errors.attendees && <p className="text-red-500">{errors.attendees}</p>}
            <button
              type="button"
              onClick={addAttendee}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Add Attendee
            </button>
          </label>

          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Update Meeting
          </button>
          </form>
        <button onClick={onClose} className="mt-4 text-blue-500">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default UpdateMeetingForm;

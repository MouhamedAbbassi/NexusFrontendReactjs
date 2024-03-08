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
  });
  const [isModalOpen, setIsModalOpen] = useState(true);

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
      });
    } catch (error) {
      console.error(`Error fetching meeting with ID ${meetingId}:`, error);
    }
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

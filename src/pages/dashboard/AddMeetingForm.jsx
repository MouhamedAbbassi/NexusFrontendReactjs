import React, { useState } from 'react';
import axios from 'axios';

const AddMeetingForm = ({ onClose, onMeetingAdded }) => {
  const [meetingData, setMeetingData] = useState({
    summary: '',
    description: '',
    startDateTime: '',
    endDateTime: '',
    attendees: [{ email: '' }],
  });

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

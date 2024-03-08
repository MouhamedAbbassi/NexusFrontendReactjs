import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMeetingForm from './AddMeetingForm';
import UpdateMeetingForm from './UpdateMettingForm';
import { Link } from 'react-router-dom';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tooltip } from 'react-tooltip';

const localizer = momentLocalizer(moment);

const AllMeetingsList = () => {
  const [meetingsList, setMeetingsList] = useState([]);
  const [showAddMeetingForm, setShowAddMeetingForm] = useState(false);
  const [showUpdateMeetingForm, setShowUpdateMeetingForm] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [selectEvent, setSelectEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    fetchMeetingsList();
  }, []);

  const fetchMeetingsList = async () => {
    try {
      const response = await axios.get('http://localhost:3000/meet');
      setMeetingsList(response.data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleUpdateClick = (id) => {
    setSelectedMeetingId(id);
    setShowUpdateMeetingForm(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/meet/delete/${id}`);
      setMeetingsList((prevMeetings) => prevMeetings.filter((meeting) => meeting._id !== id));
      console.log(`Meeting with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting meeting with ID ${id}:`, error);
    }
  };

  const toggleAddMeetingForm = () => {
    setShowAddMeetingForm(!showAddMeetingForm);
  };

  const closeUpdateMeetingForm = () => {
    setShowUpdateMeetingForm(false);
    setSelectedMeetingId(null);
  };

  const handleUpdateSuccess = () => {
    closeUpdateMeetingForm();
    fetchMeetingsList();
  };

  const handleSelectSlot = (slotInfo) => {
    setShowModal(true);
    setSelectedDate(slotInfo.start);
    setSelectEvent(null);
  };

  const handleSelectedEvent = (event) => {
    setShowModal(true);
    setSelectEvent(event);
    setEventTitle(event.title);
  };

  const saveEvent = () => {
    if (eventTitle && selectedDate) {
      if (selectEvent) {
        const updatedEvent = { ...selectEvent, title: eventTitle };
        const updatedEvents = events.map((event) =>
          event === selectEvent ? updatedEvent : event
        );
        setEvents(updatedEvents);
      } else {
        const newEvent = {
          title: eventTitle,
          start: selectedDate,
          end: moment(selectedDate)
            .add(1, "hours")
            .toDate(),
        };
        setEvents([...events, newEvent]);
      }
      setShowModal(false);
      setEventTitle("");
      setSelectEvent(null);
    }
  };

  const deleteEvents = () => {
    if (selectEvent) {
      const updatedEvents = events.filter((event) => event !== selectEvent);
      setEvents(updatedEvents);
      setShowModal(false);
      setEventTitle("");
      setSelectEvent(null);
    }
  };
  const handleAddEventToCalendar = async (meeting) => {
    const newEvent = {
      title: meeting.summary,
      start: new Date(meeting.startDateTime),
      end: new Date(meeting.endDateTime), // Modifiez ceci en fonction de votre modèle de données
    };

    // Ajouter le nouvel événement au calendrier côté client
    setEvents([...events, newEvent]);

  
  };

  return (
    <div>
      <div className="max-w-2xl mx-auto p-4">
        <button
          onClick={toggleAddMeetingForm}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ajouter Meeting
        </button>

        {showAddMeetingForm && (
          <AddMeetingForm
            onClose={toggleAddMeetingForm}
            onMeetingAdded={() => {
              fetchMeetingsList();
              toggleAddMeetingForm();
            }}
          />
        )}

        {showUpdateMeetingForm && (
          <UpdateMeetingForm
            onClose={closeUpdateMeetingForm}
            onMeetingUpdated={handleUpdateSuccess}
            meetingId={selectedMeetingId}
          />
        )}
         {/* Nouvelle section pour afficher le bouton de calendrier */}
         <div>
          <div
            data-tip="tooltip"
            data-for="calendarTooltip"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => setShowCalendar(true)}
            onMouseLeave={() => setShowCalendar(false)}
          >
            📅
          </div>

          {showCalendar && (
             <div style={{ height: "500px", margin: "50px" }}>
             <Calendar
               localizer={localizer}
               events={events}
               startAccessor="start"
               endAccessor="end"
               selectable={true}
               onSelectSlot={handleSelectSlot}
               onSelectEvent={handleSelectedEvent}
             />
           </div>
          )}

<Tooltip id="calendarTooltip">
            <span>Show Calendar</span>
          </Tooltip>
        </div>

        <ul className="mt-4">
          {meetingsList.map((meeting) => (
            <li key={meeting._id} className="bg-white shadow-md rounded-md p-4 mb-4">
              <div className="flex justify-between items-center">
                <div>
                  <strong className="text-lg">{meeting.summary}</strong>
                  <p className="text-gray-600">{meeting.startDateTime}</p>
                </div>
                <div className="space-x-2">
                  <Link to={`/meet/update/${meeting._id}`}>
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded"
                      onClick={() => handleUpdateClick(meeting._id)}
                    >
                      Update
                    </button>
                  </Link>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => handleDeleteClick(meeting._id)}
                  >
                    Delete
                  </button>
                  <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => handleAddEventToCalendar(meeting)}
                >
                  Add to Calendar
                </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
      </div>

     

      {showModal && (
        <div
          className="modal"
          style={{
            display: "block",
            backgroundColor: "rgba(0,0,0,0.5)",
            position: "fixed",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectEvent ? "Edit Event" : "Add Event"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setEventTitle("");
                    setSelectEvent(null);
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="eventTitle" className="form-label">
                  Event Title:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                {selectEvent && (
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={deleteEvents}
                  >
                    Delete Events
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={saveEvent}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AllMeetingsList;

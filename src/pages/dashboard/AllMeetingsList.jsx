import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddMeetingForm from './AddMeetingForm'; 
import UpdateMeetingForm from './UpdateMettingForm';
import { Link } from 'react-router-dom';
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tooltip } from 'react-tooltip';
import MeetScreen from './meetscreen';




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
  const [showCalendar, setShowCalendar] = useState(false); // Ajout de l'état pour afficher/cacher le calendrier

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
  const handlenavigateClick = async (link) => {
  
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

  // Fonction pour basculer l'affichage du calendrier
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
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
         
         <div>
          {/* Nouveau bouton pour afficher/cacher le calendrier */}
        <button onClick={toggleCalendar} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
          {showCalendar ? 'Cacher Calendrier' : 'Afficher Calendrier'}
        </button>

        {/* Condition pour afficher le calendrier */}
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
       <p className="text-gray-600">
  {moment(meeting.startDateTime).format('YYYY-MM-DD HH:mm')}
</p>

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
               
                 
 <Link to={`/meeting/${meeting.linkMeet}`}>
  <button
    className="bg-red-500 text-white px-3 py-1 rounded"
    onClick={() => handleStartMeeting(meeting.linkMeet)}
  >
    Start Meeting
  </button>
</Link>

                   
              

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
  <div className="fixed z-10 inset-0 overflow-y-auto">
    <div className="flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="bg-white rounded-lg p-8 z-20">
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

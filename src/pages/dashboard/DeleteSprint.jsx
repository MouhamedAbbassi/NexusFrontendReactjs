import React from 'react';
import axios from 'axios';

const DeleteSprint = ({ sprintId, onDelete }) => {
    const handleDelete = async () => {
      try {
        await axios.delete(`http://localhost:3000/sprints/${sprintId}`);
        onDelete(); // Trigger a callback to refresh the sprint list or handle state accordingly
      } catch (error) {
        console.error('Error deleting sprint:', error);
      }
    };
  
    return (
      <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}>
       <i class="fa fa-trash" aria-hidden="true"></i>
      </button>
    );
  };
  
  export default DeleteSprint;
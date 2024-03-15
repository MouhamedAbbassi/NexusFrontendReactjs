import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function Historique() {
  const { id } = useParams();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorique = async (id )=> {
      try {
        const response = await axios.get(`http://localhost:3000/historiques/${id}`);
        setHistorique(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historique:', error);
        setError('Error fetching historique');
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (historique.length === 0) {
    return <div>No historique found for this ressource</div>;
  }

  return (
    <div>
      <h2>Historique de la ressource {id}</h2>
      <ul>
        {historique.map((item, index) => (
          <li key={index}>
            <p>Date: {new Date(item.date).toLocaleString()}</p>
            <p>Description: {item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Historique;

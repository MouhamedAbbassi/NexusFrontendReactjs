import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function RessourceDetails() {
  const { id } = useParams();
  const [ressource, setRessource] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRessourceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/ressources/${id}`);
        setRessource(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ressource details:', error);
        setError('Error fetching ressource details');
        setLoading(false);
      }
    };

    fetchRessourceDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!ressource) {
    return <div>No ressource found</div>;
  }

  const filePathParts = ressource.filePath.split('\\');
  const f = filePathParts.slice(2).join('/'); // Extracting the file name without "src/images/"
  console.log("aaaaa" + f);

  return (
    <div>
      <h2>Ressource Details</h2>
      <p>ID: {ressource.filePath}</p>
      <p>File Name: {ressource.fileName}</p>
      <p>File Type: {ressource.fileType}</p>
      <p>Created At: {new Date(ressource.createdAt).toLocaleString()}</p>

     {/* Display the full file if 'f' is properly constructed */}
     {ressource.fileType!="txt" ? (
        <iframe src={`http://localhost:3000/uploads/${f}`} width='100%' height='1000'></iframe>
      ) : (
        <div>
        <a href={ressource.fileName} target="_blank" rel="noopener noreferrer">Go to link</a>
      </div>
      
      )}
    </div>
  );
}

export default RessourceDetails;

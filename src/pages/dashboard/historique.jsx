
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { CircularProgress, Typography, IconButton } from '@material-ui/core';
import { Card, CardBody, CardHeader } from '@material-tailwind/react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function Historique() {
  const { resourceId } = useParams();
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/historiques/byResourceId/${resourceId}`);
        setHistorique(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching historique:', error);
        setError('Error fetching historique');
        setLoading(false);
      }
    };

    fetchHistorique();
  }, [resourceId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  return (
    <div>
      {historique.length === 0 && <Typography variant="h6">Aucun historique trouvé pour cette ressource</Typography>}
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <div className="flex items-center">
            <IconButton component={Link} to="/ressources" style={{ marginRight: '8px' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="white">
              Historique de la ressource '{resourceId}'
            </Typography>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Name</th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">ResourceId</th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Créé le</th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Modifié le</th>
                <th className="border-b border-blue-gray-50 py-3 px-5 text-left">Détails</th>
              </tr>
            </thead>
            <tbody>
              {historique.map((item, index) => (
                <tr key={index}>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    {item.name && item.name.startsWith('https') ? (
                      <a href={item.name} target="_blank" rel="noopener noreferrer">{item.name}</a>
                    ) : (
                      <>{item.name}</>
                    )}
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{item._id}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{new Date(item.createdAt).toLocaleString()}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">{item.modifiedAt ? new Date(item.modifiedAt).toLocaleString() : '-'}</td>
                  <td className="border-b border-blue-gray-50 py-3 px-5">
                    <Link to={`/historiques/details/${item._id}`}>Détails</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}

export default Historique;
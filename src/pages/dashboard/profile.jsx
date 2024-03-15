import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, CardBody } from "@material-tailwind/react";

export function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Récupérer les informations de l'utilisateur depuis le backend
    axios.get('http://localhost:3000/users')
      .then(response => {
        setUser(response.data); // Mettre à jour l'état local avec les données de l'utilisateur
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  return (
    <div className="mx-auto mt-8 px-4 lg:px-8">
      {user && (
        <>
          <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
            <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          </div>
          <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
            <CardBody className="p-4">
              <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    size="xl"
                    variant="rounded"
                    className="rounded-lg shadow-lg shadow-blue-gray-500/40"
                  />
                  <div>
                    <Typography variant="h5" color="blue-gray" className="mb-1">
                      {user.name}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-600"
                    >
                      {user.role}
                    </Typography>
                  </div>
                </div>
                {/* Omettre les onglets ou autres éléments de navigation */}
              </div>
              {/* Afficher les informations de l'utilisateur */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-3">
                  Platform Settings
                </Typography>
                {/* Afficher d'autres informations de l'utilisateur ici */}
              </div>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}

export default Profile;

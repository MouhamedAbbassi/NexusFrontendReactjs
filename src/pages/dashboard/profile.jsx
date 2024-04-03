import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom'; // Importer useNavigate depuis react-router-dom

export function Profile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  
  const navigate = useNavigate(); // Initialiser la fonction navigate pour la redirection

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:3000/users/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    console.log('File selected:', file);
    
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token);

      const response = await axios.post('http://localhost:3000/users/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload response:', response.data);
      setImage(response.data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token from localStorage:', token); 

      if (!token) {
        console.log('Token not found in localStorage');
        return;
      }

      const response = await axios.post('http://localhost:3000/users/logout', { token });
      console.log('Logout response:', response.data);
      if (response.data) {
        localStorage.removeItem('token');
        navigate('/auth/sign-in'); // Rediriger vers la page de connexion après la déconnexion
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="mx-auto mt-8 px-4 lg:px-8">
      {user && (
        <>
          <div className="relative mt-8 h-80 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
            <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
          </div>
          <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
            <CardBody className="p-4">
              <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-6">
                  <Avatar
                    src={image || user.avatar}
                    alt={user.name}
                    size="xl"
                    variant="rounded"
                    className="w-32 h-32 rounded-lg shadow-lg shadow-blue-gray-500/40"
                  />
                  <div className="flex flex-col">
                    <Typography variant="h5" color="blue-gray" className="mb-1 font-bold text-lg">
                      {user.username}
                    </Typography>
                    <Typography
                      variant="small"
                      className="font-normal text-blue-gray-600"
                    >
                      {user.role}
                    </Typography>
                  </div>
                </div>
                <div>
                 <input type="file" onChange={handleImageUpload} accept="image/*" className="hidden" id="image-upload" style={{ cursor: 'pointer' }} />
      <label htmlFor="image-upload">
        Upload Image
      </label>
      {image && <img src={image} alt="Uploaded" className="mt-2 max-w-full h-auto" />}
                </div>
              </div>
              <div>
                <Typography variant="body" color="blue-gray" className="mb-2 font-bold">
                  UserName: {user.name}
                </Typography>
                <Typography variant="body" color="blue-gray" className="mb-2 font-bold">
                  Email: {user.email}
                </Typography>
                <Typography variant="body" color="blue-gray" className="mb-2 font-bold">
                  Phone Number: {user.phoneNumber}
                </Typography>
                <Typography variant="body" color="blue-gray" className="mb-2 font-bold">
                  Projects: {user.projects ? user.projects.length : 0}
                </Typography>
              </div>
              <Button
                variant="contained"
                onClick={handleLogout} // Appeler la fonction de logout lorsqu'on clique sur le bouton
                style={{ backgroundColor: 'black', color: 'white', marginRight: '10px' }}
              >
                Logout
              </Button>
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}

export default Profile;

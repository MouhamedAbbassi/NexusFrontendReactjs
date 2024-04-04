import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Avatar, Typography, Card, CardBody, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const navigate = useNavigate();

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
          // Charger l'image depuis le stockage local s'il y en a une
          const savedImage = localStorage.getItem('profileImage');
          if (savedImage) {
            setImage(savedImage);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageUpload = async (event) => {
    const token = localStorage.getItem('token');
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:3000/users/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data) {
        const imageURL = URL.createObjectURL(file);
        setImage(imageURL);
        setShowSaveConfirmation(true);
        // Enregistrer l'URL de l'image dans le stockage local
        localStorage.setItem('profileImage', imageURL);
      } else {
        console.error('FileName not found in upload response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const saveImage = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('image', file);
  
      const response = await axios.post('http://localhost:3000/users/save-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Save image response:', response.data);
    } catch (error) {
      console.error('Error saving image:', error); // Afficher les détails de l'erreur dans la console
    }
  };
  

  const handleSaveConfirmation = () => {
    saveImage(image);
    setShowSaveConfirmation(false);
  };

  const handleCancelSave = () => {
    setImage(null);
    setShowSaveConfirmation(false);
    // Supprimer l'image du stockage local lorsque l'utilisateur annule
    localStorage.removeItem('profileImage');
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token not found in localStorage');
        return;
      }
  
      const response = await axios.post('http://localhost:3000/users/logout', { token });
      console.log('Logout response:', response.data);
      if (response.data) {
   
        navigate('/auth/sign-in');
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
  
                  {showSaveConfirmation && (
                    <div className="flex gap-4 mt-2">
                      <Button
                        variant="contained"
                        onClick={handleSaveConfirmation}
                        style={{ backgroundColor: 'green', color: 'white' }}
                      >
                        Save Image
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={handleCancelSave}
                        style={{ borderColor: 'red', color: 'red' }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
  
                  {image && (
                    <img  />
                  )}
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
                onClick={handleLogout}
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

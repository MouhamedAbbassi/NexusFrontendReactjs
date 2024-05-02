import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  Modal,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  
} from '@mui/material';
import { Avatar, Typography, Card, CardBody, avatar } from "@material-tailwind/react";
import { useNavigate, useSearchParams } from 'react-router-dom';

export function Profile() {
  const [user, setUser] = useState();
  const [image, setImage] = useState(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const ghToken = searchParams.get('github-token');
  const googleToken = searchParams.get('google-token');
  const username = searchParams.get('username');
  
  
  useEffect(() =>{
    const token = localStorage.getItem('token');
if (ghToken && token !== ghToken) {
localStorage.setItem('token', ghToken);

}
else if (googleToken && token !== googleToken) {
  localStorage.setItem('token', googleToken);
}
  }, []);
  

  const isValidObjectId = (id) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      alert("New Password and Confirm Password don't match!");
      return;
    }

    const userId = localStorage.getItem('idUser');

    if (!userId) {
      alert("User ID not found. Please log in again.");
      return;
    }

    if (!isValidObjectId(userId)) {
      alert("Invalid user ID format");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:3000/users/change-password`,
        {
      
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert(response.data.message);
      setOpenChangePasswordModal(false);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      alert('Failed to change password: ' + errorMsg);
    }
  };

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
          console.log(response.data);
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
    const userId = localStorage.getItem('idUser');
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        `http://localhost:3000/users/upload/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      if (response.data) {
        const imageURL = URL.createObjectURL(file);
        setImage(imageURL);
        setShowSaveConfirmation(true);
        localStorage.setItem('profileImage', response.data);
      } else {
        console.error('FileName not found in upload response');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    
  };

  const handleSaveUser = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('idUser');
    const endpoint = `http://localhost:3000/users/update-profile`;

    try {
      const response = await axios.post(endpoint, user,  {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      handleCloseModal();
    } catch (error) {
      console.error('Error saving/updating user:', error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(event.target)
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleSaveConfirmation = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('idUser');
      const formData = new FormData();
      const file = await fetch(image);
      const blob = await file.blob();
      formData.append('image', blob);

      const response = await axios.post(`http://localhost:3000/users/upload/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update profile response:', response.data);
      setShowSaveConfirmation(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancelSave = () => {
    setShowSaveConfirmation(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('Token not found in localStorage');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const response = await axios.put('http://localhost:3000/users/logout', { token }, config);
      console.log('Logout response:', response.data);
      if (response.data) {
        // navigate('/auth/sign-in');
      }
    } catch (error) {
      console.error('Logout error:', error.data);
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
                    src={user.profileAvatar  }
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
                    <img />
                  )}
                </div>
              </div>

              <div>

                <Typography variant="body" color="blue-gray" className="mb-2 font-bold">
                  UserName: {user.name}
                </Typography>
                {user.email &&  <Typography variant="body" color="blue-gray" className="mb-2 font-bold">
                  Email: {user.email}
                </Typography>}
                {user.phoneNumber &&<Typography variant="body" color="blue-gray" className="mb-2 font-bold">
                  Phone Number: {user.phoneNumber}
                </Typography>}
               <div style={{ marginBottom: '10px' }}>
  <Button
    variant="contained"
    onClick={() => setOpenModal(true)}
    style={{ backgroundColor: 'black', color: 'white' }}
  >
    Edit Profile
  </Button>
</div>

<div style={{ marginBottom: '10px' }}>
{!(ghToken || googleToken) && <Button
    variant="contained"
    onClick={() => setOpenChangePasswordModal(true)}
    style={{ backgroundColor: 'black', color: 'white' }}
  >
    Change Password
  </Button>}
</div>

              </div>

            </CardBody>
          </Card>
        </>
      )}

      {user && (
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <Typography variant="h6" gutterBottom>
              'Edit Profile'
            </Typography>
            <TextField label="Name" variant="outlined" fullWidth margin="normal" name="name" value={user.name} onChange={handleChange} />
           {!ghToken && <TextField label="Email" variant="outlined" fullWidth margin="normal" name="email" value={user.email} onChange={handleChange} />}
           {!ghToken && <TextField label="Password" variant="outlined" fullWidth margin="normal" type="password" name="password"  onChange={handleChange} />}

          {!ghToken &&  <TextField label="Phone Number" variant="outlined" fullWidth margin="normal" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} />}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button variant="contained" color="inherit" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button variant="contained" color="primary" onClick={handleSaveUser}>
                Save
              </Button>
            </Box>
          </Box>
        </Modal>
      )}

      <Dialog
        open={openChangePasswordModal}
        onClose={() => setOpenChangePasswordModal(false)}
        aria-labelledby="change-password-dialog-title"
      >
      <DialogTitle id="change-password-dialog-title">Change Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="currentPassword"
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            id="newPassword"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePasswordModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} color="primary">
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Profile;

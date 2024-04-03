import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Modal,
  Box,
  Typography,

} from '@mui/material';
import axios from 'axios';
import './users.css'
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';



export function Users() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phoneNumber: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const itemsPerPage = 5;
  const [userIdToDelete, setUserIdToDelete] = useState(null); // Nouvel état pour stocker l'ID de l'utilisateur à supprimer
  const token = localStorage.getItem('token');


  const paginateData = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  const fetchUsers = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/users/search?searchTerm=${searchTerm}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setFilteredUsers(response.data); // Mettre à jour les utilisateurs filtrés
  } catch (error) {
    console.error('Error fetching users by search term:', error);
  }
};

// Appelez fetchUsersBySearchTerm lorsque le terme de recherche change
useEffect(() => {
  fetchUsers();
}, [searchTerm]);

const handleLogout = async (navigate) => {
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
     navigate('/auth/sign-in');
     
   }

   
  } catch (error) {
    console.error('Logout error:', error);
  }
};






  
  
  
  
  const handleAddUser = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, user not authenticated');
      return; // Arrêtez l'exécution si le token est manquant
    }
  
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'user',
      phoneNumber: '',
    });
    setEditUser(null);
  };

  const handleSaveUser = async () => {
    try {
      const endpoint = editUser ? `http://localhost:3000/users/${editUser._id}` : 'http://localhost:3000/users/add';
      const method = editUser ? 'put' : 'post';
  
      const response = await axios[method](endpoint, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('User operation successful:', response.data);
      handleCloseModal();
      fetchUsers(); 
      setCurrentPage(1);// Rafraîchir la liste des utilisateurs après l'ajout/modification
    } catch (error) {
      console.error('Error saving/updating user:', error.response ? error.response.data : error.message);
    }
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: '', // Doit être vide pour la mise à jour, ne pas afficher le mot de passe
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
    setOpenModal(true);
  };

  // Fonction pour ouvrir la modal de confirmation de suppression
  const handleOpenConfirmDelete = (userId) => {
    setUserIdToDelete(userId);
    setConfirmDeleteOpen(true);
  };

  const handleCancelDelete = () => {
    setUserIdToDelete(null);
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axios.delete('http://localhost:3000/users/delete', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: userIdToDelete,
        },
      });
      console.log('User deleted successfully:', response.data);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error.response ? error.response.data : error.message);
    }
    handleCancelDelete();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setOpenViewModal(true);
  };

  const handleCloseViewModal = () => {
    setSelectedUser(null);
    setOpenViewModal(false);
  };

  const handlePrintPDF = () => {
    if (!selectedUser) return;

    const doc = new jsPDF();
    doc.text(`User Details\n\nName: ${selectedUser.name}\nEmail: ${selectedUser.email}\nPhone Number: ${selectedUser.phoneNumber}`, 10, 10);
    doc.save('user_details.pdf');
  };

  const getInitials = (name) => {
    if (!name) return '';
  
    const names = name.split(' ');
    const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
    return initials;
  };
  
  
  const paginatedUsers = paginateData(filteredUsers, currentPage, itemsPerPage);

  return (
    <Container maxWidth="xl">
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px' }}
        />
<Button
        variant="contained"
        onClick={() => {handleLogout(navigate)}}
        style={{ backgroundColor: 'black', color: 'white', marginRight: '10px' }}
      >
        Logout
      </Button>

      <Button
        variant="contained"
        color="primary"
        onClick={handleAddUser}
        style={{ backgroundColor: 'black', color: 'white' }}
      >
        +
      </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
  {filteredUsers.map((user) => (
    <TableRow key={user._id}>
      <TableCell>
        <div className="avatar-circle">
          {getInitials(user.name)}
        </div>
        {user.name}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.phoneNumber}</TableCell>
      <TableCell>
                <span className={`userStatus ${user.active ? 'userOnline' : 'userOffline'}`}>
                  {user.active ? 'Online' : 'Offline'}
                </span>
              </TableCell>
             
      <TableCell>
  <div className="button-container">
  <Button variant="outlined" className="edit-button" onClick={() => handleEditUser(user)}>Edit</Button>
  <Button variant="outlined" className="delete-button" onClick={() => handleOpenConfirmDelete(user._id)}>Delete</Button>
  <Button variant="outlined" className="view-button" onClick={() => handleViewUser(user)}>View</Button>
 </div>

      </TableCell>
    </TableRow>
  ))}
</TableBody>
      </Table>
      <Pagination
        count={Math.ceil(filteredUsers.length / itemsPerPage)}
        page={currentPage}
        onChange={(event, page) => setCurrentPage(page)}
        variant="outlined"
        shape="rounded"
        style={{ marginTop: '20px' }}
      />

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            {editUser ? 'Edit User' : 'Add New User'}
          </Typography>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="name"
            value={newUser.name}
            onChange={handleChange}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            value={newUser.email}
            onChange={handleChange}
          />
          {!editUser && (
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              name="password"
              value={newUser.password}
              onChange={handleChange}
            />
          )}
          <TextField
            label="Phone Number"
            variant="outlined"
            fullWidth
            margin="normal"
            name="phoneNumber"
            value={newUser.phoneNumber}
            onChange={handleChange}
          />
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

      {/* Modal de confirmation de suppression */}
      <Modal open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Confirm Delete
          </Typography>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to delete this user?
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="contained" color="inherit" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleConfirmDelete}>
              Confirm Delete
            </Button>
          </Box>
        </Box>
      </Modal>
     <Modal open={openViewModal} onClose={handleCloseViewModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" gutterBottom>
            User Details
          </Typography>
          {selectedUser && (
            <div>
              <Typography variant="body1" gutterBottom>Name: {selectedUser.name}</Typography>
              <Typography variant="body1" gutterBottom>Email: {selectedUser.email}</Typography>
              <Typography variant="body1" gutterBottom>Phone Number: {selectedUser.phoneNumber}</Typography>
            </div>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="contained" color="inherit" onClick={handleCloseViewModal}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={handlePrintPDF}>
              Print PDF
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
 
}

export default Users;

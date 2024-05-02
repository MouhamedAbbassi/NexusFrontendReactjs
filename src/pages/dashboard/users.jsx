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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import axios from 'axios';
import './users.css';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

export function Users() {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);
  const [ openViewModal, setOpenViewModal ] = useState( false );
   
  const [userId, setUserId] = useState(''); // Assume there's a way to set this, e.g., from props or context
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  //localStorage.getItem('idUser')

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



  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
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
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const token = localStorage.getItem('token');
  const itemsPerPage = 5;

  const paginateData = (data, currentPage, itemsPerPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/users/search?searchTerm=${searchTerm}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredUsers(response.data);
    } catch (error) {
      console.error('Error fetching users by search term:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm]);

{/*const handleLogout = async () => {
  try {
    const response = await axios.put('http://localhost:3000/users/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.data && response.data.user && response.data.user.logoutDate) {
      const logoutDate = new Date(response.data.user.logoutDate);
      if (!isNaN(logoutDate.getTime())) {
        // Clear local storage and navigate to the login page
        localStorage.removeItem('token');
        localStorage.setItem('logoutDate', logoutDate.toISOString()); // Store the logout date in ISO 8601 format
        navigate('/auth/sign-in');
      } else {
        console.error('Invalid logout date received from server:', response.data.user.logoutDate);
      }
    } else {
      console.error('Invalid response from server:', response.data);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};
*/}




  const handleAddUser = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUser({ name: '', email: '', password: '', role: 'user', phoneNumber: '' });
    setEditUser(null);
  };

  const handleSaveUser = async () => {
    const endpoint = editUser ? `http://localhost:3000/users/${editUser._id}` : 'http://localhost:3000/users/add';
    const method = editUser ? 'put' : 'post';

    try {
      const response = await axios[method](endpoint, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      handleCloseModal();
      fetchUsers();
      setCurrentPage(1);
    } catch (error) {
      console.error('Error saving/updating user:', error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: '', // Password not shown for security
      role: user.role,
      phoneNumber: user.phoneNumber,
    });
    setOpenModal(true);
  };

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
    return name.split(' ').map(n => n.charAt(0).toUpperCase()).join('');
  };

  const paginatedUsers = paginateData(filteredUsers, currentPage, itemsPerPage);
// Assurez-vous que la date de déconnexion (logoutDate) est au format ISO 8601 valide
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  const options = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    timeZoneName: 'short' 
  };
  return date.toLocaleString(undefined, options); // Ajustez le formatage si nécessaire
};

// Utilisation de la fonction formatDate pour afficher la date de déconnexion dans le tableau




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
       {/* <Button
          variant="contained"
          onClick={handleLogout}
          style={{ backgroundColor: 'black', color: 'white', marginRight: '10px' }}
        >
          Logout
  </Button>*/}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setOpenChangePasswordModal(true)}
          style={{ backgroundColor: 'black', color: 'white', marginRight: '10px' }}
        >
          Change Password
        </Button>
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
             <TableCell>Logout Date</TableCell> 
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell>
                <div className="avatar-circle">{getInitials(user.name)}</div>
                {user.name}
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{ user.phoneNumber }</TableCell>
              
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
              <TableCell>{user.active ? '' : (user.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : '')}</TableCell>
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
          <TextField label="Name" variant="outlined" fullWidth margin="normal" name="name" value={newUser.name} onChange={handleChange} />
          <TextField label="Email" variant="outlined" fullWidth margin="normal" name="email" value={newUser.email} onChange={handleChange} />
          {!editUser && (
            <TextField label="Password" variant="outlined" fullWidth margin="normal" type="password" name="password" value={newUser.password} onChange={handleChange} />
          )}
          <TextField label="Phone Number" variant="outlined" fullWidth margin="normal" name="phoneNumber" value={newUser.phoneNumber} onChange={handleChange} />
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
      <Modal open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width :'400', bgcolor: 'background.paper', boxShadow :'24', p: '4' }}>
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
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width:' 400', bgcolor: 'background.paper', boxShadow :'24', p: '4' }}>
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

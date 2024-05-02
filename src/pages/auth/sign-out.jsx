import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



export const SignOut = () => {
    const navigate = useNavigate();
    useEffect ( () => {
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
               navigate('/auth/sign-in');
               
             }
          
             
            } catch (error) {
              console.error('Logout error:', error);
            }
          };
          handleLogout();
    } ,[])
    return  (
        <div>
        
        </div>
    )
}



// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export const SignOut = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const handleLogout = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 console.log('Token from localStorage:', token);

//                 if (!token) {
//                     console.log('Token not found in localStorage');
//                     return;
//                 }

//                 const response = await axios.put('http://localhost:3000/users/logout', {}, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });

//                 console.log('Logout response:', response.data);

//                 if (response.data && response.data.user && response.data.user.logoutDate) {
//                     const logoutDate = new Date(response.data.user.logoutDate);

//                     if (!isNaN(logoutDate.getTime())) {
//                         localStorage.removeItem('token');
//                         localStorage.setItem('logoutDate', logoutDate.toISOString());
//                         navigate('/auth/sign-in');
//                     } else {
//                         console.error('Invalid logout date received from server:', response.data.user.logoutDate);
//                     }
//                 } else {
//                     console.error('Invalid response from server:', response.data);
//                 }
//             } catch (error) {
//                 console.error('Logout error:', error);
//             }
//         };

//         handleLogout();
//     }, [navigate]);

//     return null; // Return null since this component doesn't render anything
// };

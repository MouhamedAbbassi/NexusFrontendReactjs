import { useEffect, useState } from 'react';

import { jwtDecode } from 'jwt-decode';
import { Unauthorized } from './pages/unauthorized';
import React from "react";
import { Navigate, Route } from 'react-router-dom';

const PrivateRoute = ({ element, roles}) => {
    const [allowed, setAllowed] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  


    useEffect(() => {
        
        const fetchUserRole = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken = jwtDecode(token);
                    const { role } = decodedToken;
                    console.log(role);
                    setAllowed(roles.includes(role));
                }                   

            } catch (error) {
                console.error('Error fetching user role:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserRole();
    }, [isLoading]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        allowed? (
            element
        ) : (
            <Navigate to="/unauthorized" 
            replace 
            
            />
            
        )
    )
};

export default PrivateRoute;
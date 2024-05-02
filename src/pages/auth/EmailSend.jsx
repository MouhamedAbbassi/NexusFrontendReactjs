import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VerifyOTP from './VerifyOTP';
import LOGO from "../../../public/img/NEXUS-LOGO.png";

const logoStyle = {
  display: "block",
  margin: "20px auto 30px", // Espace entre le logo et le formulaire
  width: '80px',
  height: 'auto',
  borderRadius: '8px',
};

function EmailSend() {
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState(null);
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/users/password-recovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data);
      setShowVerifyOTP(true);
      setUserId(data.userId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', width: '500px', border: '1px solid black' }}>
        <center>
          <img src={LOGO} style={logoStyle} alt="NEXUS Logo" />
        </center>
        {!showVerifyOTP ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Send Email</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}> {/* Ajout de la marge en haut */}
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', width: '400px' }}
              />
              <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: 'black', color: 'white', border: 'none', width: '400px', marginTop: '10px' }}>Send Email</button>
            </form>
          </div>
        ) : (
          <VerifyOTP email={email} userId={userId} />
        )}
      </div>
    </div>
  );
}

export default EmailSend;

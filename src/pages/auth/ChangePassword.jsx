import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha'; // Import the reCAPTCHA component

function ChangerPassword() {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showVerifyOTP, setShowVerifyOTP] = useState(false);
  const navigate = useNavigate();

  // Handle reCAPTCHA onChange event
  const onChange = (value) => {
    console.log("Captcha value:", value);
    // Here you can use the value if needed
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Your existing password validation logic
    if (newPassword !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
    try {
      // Your axios request
      const response = await axios.put('http://localhost:3000/users/reset-password', { email, newPassword });
      setMessage(response.data.message);
      setShowVerifyOTP(true);
      navigate('/signin');
    } catch (error) {
      // Your error handling logic
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Une erreur est survenue lors du changement de mot de passe');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', width: '500px' }}>
        {!showVerifyOTP ? (
          <div>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Changer le mot de passe</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
                style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', width: '400px' }}
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                required
                style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', width: '400px' }}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmez le nouveau mot de passe"
                required
                style={{ padding: '10px', margin: '10px 0', borderRadius: '5px', width: '400px' }}
              />
              <ReCAPTCHA sitekey="6LeQG5MpAAAAAEAcplIyVNa1WWeHnqd5TWdF98Pe" onChange={onChange} />
              <button type="submit" style={{ padding: '10px', borderRadius: '5px', backgroundColor: 'black', color: 'white', border: 'none', width: '400px', marginTop: '10px' }}>Changer le mot de passe</button>
            </form>
            {message && <p style={{ color: 'black', textAlign: 'center', marginTop: '10px' }}>{message}</p>}
          </div>
        ) : (
          <div>
            {/* Your component for verifying OTP */}
            <button onClick={() => navigate('/')} style={{ padding: '10px', borderRadius: '5px', backgroundColor: 'black', color: 'white', border: 'none', width: '400px', marginTop: '10px' }}>Retour à l'accueil</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangerPassword;

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function VerifyOTP({ email }) {
  const { resetToken } = useParams();
  const navigate = useNavigate();

  const [otp, setOTP] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const otpInputs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setExpired(true);
          return prevTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleInputChange = (index, value) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expired) {
        setError('OTP has expired. Please request a new one.');
        return;
      }

      const joinedOTP = otp.join('');
      const response = await axios.post('http://localhost:3000/users/verify-otp', {
        email,
        otp: joinedOTP,
        resetToken,
      });
      console.log(response.data);
      navigate(`/auth/change-password`);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setError('Invalid OTP. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              ref={(input) => (otpInputs.current[index] = input)}
              style={{ width: '40px', height: '40px', fontSize: '20px', textAlign: 'center' }}
              required
              disabled={expired}
            />
          ))}
        </div>
        <button type="submit" disabled={expired}>Verify OTP</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!expired && <p>Time left: {timeLeft} seconds</p>}
      </form>
      {expired && (
        <button style={{ backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '5px', marginTop: '10px' }} onClick={() => navigate(-1)}>Retry</button>
      )}
    </div>
  );
}

export default VerifyOTP;

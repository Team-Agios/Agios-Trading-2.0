import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Verify.css'; // Importăm fișierul CSS

const Verify: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Confirming your email...');

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/verify/${token}`);
        
        console.log('Response status:', response.status);
        console.log('Response data:', response.data);

        if (response.status !== 200) {
          throw new Error('Error verifying email');
        }

        setMessage('Your email has been confirmed. Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 20000); // Redirecționează după 20 de secunde
      } catch (error: any) {
        setMessage('Error confirming your email. Please try again.');
        console.error('Fetch error:', error.message);
      }
    };

    confirmEmail();
  }, [token, navigate]);

  return (
    <div className="verify-container">
      <div className="verify-card">
        <h2>Email Confirmation</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Verify;

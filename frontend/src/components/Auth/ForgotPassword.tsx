import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/auth/send-reset-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                // Redirecționarea către pagina ResetPassword cu email-ul în state
                navigate('/reset-password', { state: { email } });
            } else {
                const errorData = await response.json();
                if (errorData.message) {
                    setError(errorData.message);
                } else {
                    setError('Failed to send reset code. Please try again.');
                }
            }
        } catch (err: any) {
            if (err instanceof TypeError) {
                setError('Network error. Please check your internet connection and try again.');
            } else if (err.message) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
            console.error('There was an error!', err);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2>Forgot Password</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axiosConfig';
import './Login.css';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('/auth/login', { email, password });
            const { token, userId } = response.data;
            localStorage.setItem('authToken', token);
            localStorage.setItem('userId', userId);
            navigate('/otp', { state: { email, password } }); // Transmite email și parolă
        } catch (error) {
            setErrorMessage('Invalid email or password.');
            console.error('There was an error logging in!', error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {errorMessage && <div className="error-message">{errorMessage}</div>}
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                <p>
                    <a href="/forgot-password">Forgot Password?</a>
                </p>
                <p>
                    Not a member? <a href="/register">Sign up now</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

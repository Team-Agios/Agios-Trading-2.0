import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BusinessNews from './pages/BusinessNews';
import StockList10 from './pages/Products';
import Transactions from './pages/Transactions';
import Balance from './pages/Balance'; // Import the Balance component
import Chatbot from './pages/Chatbot';
import Otp from './components/Auth/Otp';
import Verify from './components/Auth/Verify';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login/:userId?" element={<Login />} />
        <Route path="/register/:referralCode?" element={<Register />} />
        <Route path="/verify/:token" element={<Verify />} />
        <Route path="/forgot-password/:token?" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Login />} />
        <Route path="/news" element={<BusinessNews />} />
        <Route path="/stocks" element={<StockList10 />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/balance" element={<Balance />} /> {/* Add the Balance route */}
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/otp" element={<Otp />} />
      </Routes>
    </Router>
  );
};

export default App;

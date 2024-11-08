import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { FaTachometerAlt, FaBuilding, FaBox, FaDollarSign, FaCog, FaBalanceScale } from 'react-icons/fa';
import ProfileCard from './ProfileCard';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <div>
                <ProfileCard />
                <div className="admins-menu">
                    <div className="admins-menu-title">Menu:</div>
                    <ul className="navbar-links">
                        <li className="active">
                            <Link to="/home" className="button">
                                <FaTachometerAlt className="icon" /> Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link to="/news" className="button">
                                <FaBuilding className="icon" /> Business Info
                            </Link>
                        </li>
                        <li>
                            <Link to="/stocks" className="button">
                                <FaBox className="icon" /> Products
                            </Link>
                        </li>
                        <li>
                            <Link to="/transactions" className="button">
                                <FaDollarSign className="icon" /> Transactions
                            </Link>
                        </li>
                        <li>
                        <Link to="/balance" className="button">
                            <FaBalanceScale className="icon" /> Balance
                        </Link>
                    </li>
                    </ul>
                </div>
            </div>
            <Link to="/settings" className="settings-button">
                <FaCog className="icon" /> Settings
            </Link>
        </nav>
    );
};

export default Navbar;

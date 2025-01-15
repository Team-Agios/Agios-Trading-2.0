import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import axios from '../../config/axiosConfig';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null); // Sold local pentru Navbar

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Funcția de preluare a soldului pentru Navbar
  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (token) {
        const response = await axios.get("/balance/get", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBalance(response.data.balance ?? 0); // Actualizăm soldul
      }
    } catch (error) {
      console.error("Error fetching balance for Navbar:", error);
      setBalance(0); // Setăm soldul implicit la 0 în caz de eroare
    }
  };

  useEffect(() => {
    fetchBalance(); // Preluăm soldul la montarea componentei Navbar
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="logo">
          {/* Logo-ul */}
        </div>
        <h2>
          Agios-Trading{balance !== null ? `: $${balance.toFixed(2)}` : " (Loading...)"}
        </h2>
      </div>
      <div className="navbar-right">
        <button className="menu-toggle" onClick={toggleMenu}>
          &#9776;
        </button>
        <nav className={`navbar-links ${menuOpen ? "open" : ""}`}>
          <Link to="/home" onClick={closeMenu}>Home</Link>
          <Link to="/stocks" onClick={closeMenu}>Market</Link>
          <Link to="/news" onClick={closeMenu}>News</Link>
          <Link to="/transactions" onClick={closeMenu}>History</Link>
          <Link to="/profile" onClick={closeMenu}>Account</Link>
          <Link to="/depozit" onClick={closeMenu}>Depozit</Link>
        </nav>
        <div className="navbar-buttons">
          <Link to="/profile">
            <div className="profile-pic"></div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

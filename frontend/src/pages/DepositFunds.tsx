import React, { useState } from 'react';
import Navbar from '../components/Home/Navbar';
import './DepositFunds.css';
import Chatbot from './Chatbot';

const DepositFunds: React.FC = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };
  return (
    <div className="deposit-funds-container">
      {/* Include Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="layout-container">
        <div className="layout-content-container">
          <h1 className="title">Deposit funds</h1>
          <p className="description">
            Choose a funding method to deposit money into your account. For ACH and wire transfers, please allow 1-3
            business days for the funds to appear in your account.
          </p>
          <div className="options">
            <label className="option">
              <input type="radio" name="funding-method" className="radio-input" defaultChecked />
              <div className="option-text">Wire transfer</div>
            </label>
            <label className="option">
              <input type="radio" name="funding-method" className="radio-input" />
              <div className="option-text">ACH transfer</div>
            </label>
            <label className="option">
              <input type="radio" name="funding-method" className="radio-input" />
              <div className="option-text">Check</div>
            </label>
          </div>
          <h3 className="section-title">Wire Transfer</h3>
          <p className="section-description">Please use the following information to complete your transfer:</p>
          <div className="details-grid">
            <div className="detail">
              <p className="label">Account number</p>
              <p className="value">1234567890</p>
            </div>
            <div className="detail">
              <p className="label">Bank name</p>
              <p className="value">Stockbank</p>
            </div>
            <div className="detail">
              <p className="label">Bank address</p>
              <p className="value">123 Wall Street, New York, NY 10005</p>
            </div>
            <div className="detail">
              <p className="label">SWIFT code</p>
              <p className="value">STOCKUS33</p>
            </div>
          </div>
          <div className="button-container">
            <button className="button">Copy instructions</button>
          </div>
          <h3 className="section-title">ACH Transfer</h3>
          <p className="section-description">Please use the following information to complete your transfer:</p>
          <div className="details-grid">
            <div className="detail">
              <p className="label">Account number</p>
              <p className="value">1234567890</p>
            </div>
            <div className="detail">
              <p className="label">Routing number</p>
              <p className="value">123456789</p>
            </div>
          </div>
          <div className="button-container">
            <button className="button">Copy instructions</button>
          </div>
          <h3 className="section-title">Check</h3>
          <p className="section-description">
            Please make the check payable to: Stockbank, Inc. and mail to: 123 Wall Street, New York, NY 10005
          </p>
          <div className="button-container">
            <button className="button">Copy instructions</button>
          </div>
        </div>
      </div>

        <button className="chatbot-icon" onClick={toggleChatbot}>
          💬
        </button>
        {chatbotVisible && <Chatbot />}

    </div>
    
  );
};

export default DepositFunds;

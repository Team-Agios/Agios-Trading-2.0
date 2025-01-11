import React, { useState, useEffect } from 'react';
import Navbar from '../Home/Navbar';
import './DepositFunds.css';
import Chatbot from './Chatbot';

const DepositFunds: React.FC = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
    cardHolderName: '',
    transferAmount: '',
  });

  useEffect(() => {
    // Request pentru a obține metodele de plată
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch('/api/payment-methods'); // Endpointul pentru obținerea metodelor de plată
        const data = await response.json();
        setPaymentMethods(data); // Presupunem că backend-ul returnează un array de metode de plată
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }
    };

    fetchPaymentMethods();
  }, []);

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/process-card-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Payment processed:', data);
      alert('Payment successfully submitted!');
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error processing payment. Please try again.');
    }
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
            {paymentMethods.map((method, index) => (
              <label key={index} className="option">
                <input type="radio" name="funding-method" className="radio-input" />
                <div className="option-text">{method.name}</div>
              </label>
            ))}
          </div>

          {/* Example Wire Transfer */}
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

          {/* ACH Transfer Form */}
          <h3 className="section-title">ACH Transfer</h3>
          <p className="section-description">Enter your card details and the amount to complete the transfer:</p>
          <form className="ach-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="transferAmount" className="form-label">Transfer Amount</label>
              <input
                type="number"
                id="transferAmount"
                name="transferAmount"
                className="form-input"
                value={formData.transferAmount}
                onChange={handleInputChange}
                placeholder="Enter amount"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cardNumber" className="form-label">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                className="form-input"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expirationDate" className="form-label">Expiration Date</label>
              <input
                type="text"
                id="expirationDate"
                name="expirationDate"
                className="form-input"
                placeholder="MM/YY"
                value={formData.expirationDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cvv" className="form-label">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                className="form-input"
                value={formData.cvv}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="cardHolderName" className="form-label">Cardholder Name</label>
              <input
                type="text"
                id="cardHolderName"
                name="cardHolderName"
                className="form-input"
                value={formData.cardHolderName}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="button">Submit Payment</button>
          </form>

          {/* Example Check */}
          <h3 className="section-title">Check</h3>
          <p className="section-description">
            Please make the check payable to: Stockbank, Inc. and mail to: 123 Wall Street, New York, NY 10005
          </p>
          <div className="button-container">
            <button className="button">Copy instructions</button>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <button className="chatbot-icon" onClick={toggleChatbot}>
        💬
      </button>
      {chatbotVisible && <Chatbot />}
    </div>
  );
};

export default DepositFunds;

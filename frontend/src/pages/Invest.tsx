import React, { useState } from "react";
import Navbar from "../components/Home/Navbar";
import "./Invest.css";
import Chatbot from "./Chatbot";

const Invest = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };
  return (
    <div className="invest-root">
      <Navbar />
      <main>
        <section className="intro">
          <h1>Buy and sell stocks</h1>
          <p>Trade your favorite companies, ETFs, and cryptocurrencies.</p>
          <label className="search">
            <input type="text" placeholder="e.g., AAPL, TSLA" />
          </label>
        </section>

        {/* Stocks Section */}
        <section className="stocks">
          <h2>Stocks and ETFs</h2>
          <div className="stock-card">
            <div className="stock-details">
              <div className="stock-image"></div>
              <div>
                <p>Apple Inc.</p>
                <span>$35.00 per share</span>
              </div>
            </div>
            <div className="stock-price">$135.00</div>
          </div>
        </section>

        {/* Order Type Section */}
        <section className="order-type">
          <h2>Order type</h2>
          <div className="radio-group">
            <label>
              <input type="radio" name="order" defaultChecked /> Market
            </label>
            <label>
              <input type="radio" name="order" /> Limit
            </label>
            <label>
              <input type="radio" name="order" /> Stop
            </label>
            <label>
              <input type="radio" name="order" /> Stop Limit
            </label>
          </div>
        </section>

        {/* Quantity Section */}
        <section className="quantity">
          <h2>Quantity</h2>
          <div className="slider">
            <span>1</span>
            <div className="slider-bar">
              <div className="slider-thumb"></div>
            </div>
            <span>10</span>
          </div>
        </section>

        {/* Time in Force Section */}
        <section className="time-in-force">
          <h2>Time in force</h2>
          <div className="radio-group">
            <label>
              <input type="radio" name="time" defaultChecked /> Good till cancel (GTC)
            </label>
            <label>
              <input type="radio" name="time" /> Day
            </label>
          </div>
        </section>

        {/* Estimated Cost Section */}
        <section className="cost">
          <h2>Estimated cost</h2>
          <p>$350.00</p>
          <button>Review order</button>
        </section>
      </main>

      <button className="chatbot-icon" onClick={toggleChatbot}>
          💬
        </button>
        {chatbotVisible && <Chatbot />}
    </div>
  );
};

export default Invest;

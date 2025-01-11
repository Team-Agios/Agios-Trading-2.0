import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import './Home.css';
import Navbar from '../Home/Navbar';
import Chatbot from './Chatbot'; 
import Chart from '../Home/Chart'; // Importă componenta Chart

interface Stock {
  symbol: string;
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
}

const Home: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);

  useEffect(() => {
    const fetchMarketSummary = async () => {
      try {
        const response = await axios.get('/market/market-summary');
        setStocks(response.data.stocks);
        setIsLoading(false);
      } catch (error) {
        setError('Error fetching market summary');
        setIsLoading(false);
      }
    };

    fetchMarketSummary();
  }, []);

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        <div className="home-header">
          <h2>Today, 17 May 2024</h2>
          <div className="header-icons">
            <i className="icon-search">🔍</i>
            <i className="icon-bell">🔔</i>
            <i className="icon-settings">⚙️</i>
          </div>
        </div>
        <div className="cards">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            stocks.map((stock, index) => {
              const cardColors = ['green', 'red', 'blue', 'brown'];
              return (
                <div
                  key={index}
                  className={`card ${cardColors[index % cardColors.length]}`}
                >
                  <div className="card-content">
                    <div className="card-title">{stock.symbol}</div>
                    <div className="card-value">${stock.currentPrice.toFixed(2)}</div>
                    <div
                      className={`card-change ${
                        stock.currentPrice > stock.previousClosePrice ? 'green' : 'red'
                      }`}
                    >
                      {`$${(
                        stock.currentPrice - stock.previousClosePrice
                      ).toFixed(2)} (${(
                        ((stock.currentPrice - stock.previousClosePrice) /
                          stock.previousClosePrice) *
                        100
                      ).toFixed(2)}%)`}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="chart-container">
          <Chart /> {/* Reintroducem componenta Chart */}
        </div>
        <button className="chatbot-icon" onClick={toggleChatbot}>
          💬
        </button>
        {chatbotVisible && <Chatbot />}
      </div>
    </div>
  );
};

export default Home;

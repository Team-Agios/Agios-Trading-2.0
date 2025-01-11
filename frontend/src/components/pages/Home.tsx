import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import './Home.css';
import Navbar from '../Home/Navbar';
import Chatbot from './Chatbot'; 
import Chart from '../Home/Chart';

interface Stock {
  symbol: string;
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
}

const Home: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]); // Toate stocurile
  const [ownedStocks, setOwnedStocks] = useState<Stock[]>([]); // Stocuri cumpărate
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);

  useEffect(() => {
    const fetchMarketSummary = async () => {
      try {
        const response = await axios.get('/market/market-summary');
        console.log('API Response:', response.data);
    
        const fetchedStocks: Stock[] = response.data.stocks;
    
        // Folosim toate stocurile returnate pentru secțiunea Owned Stocks
        setStocks(fetchedStocks);
        setOwnedStocks(fetchedStocks); // Toate stocurile sunt considerate achiziționate
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching market summary:', error);
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
        <h2>Today, {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h2>
        </div>

        {/* Acțiuni cumpărate */}
        <div className="owned-stocks">
          <h3>Owned Stocks</h3>
          <div className="cards">
            {ownedStocks.length > 0 ? (
              ownedStocks.map((stock, index) => (
                <div key={index} className="card">
                  <div className="card-title">{stock.symbol}</div>
                  <div className="card-value">${stock.currentPrice.toFixed(2)}</div>
                </div>
              ))
            ) : (
              <p>You don’t own any stocks yet.</p>
            )}
          </div>
        </div>


        {/* Toate stocurile */}
        <div className="cards">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            stocks.map((stock, index) => (
              <div key={index} className="card">
                <div className="card-content">
                  <div className="card-title">{stock.symbol}</div>
                  <div className="card-value">
                    ${stock.currentPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="chart-container">
          <Chart />
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


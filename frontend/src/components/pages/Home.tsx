import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import './Home.css';
import Navbar from '../Home/Navbar';
import Chatbot from './Chatbot';
import Chart from '../Home/Chart';

interface Stock {
  symbol: string;
  totalInvested: number;
  averagePrice: number;
}

const Home: React.FC = () => {
  const [ownedStocks, setOwnedStocks] = useState<Stock[]>([]); // User-owned stocks
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatbotVisible, setChatbotVisible] = useState(false);

  useEffect(() => {
    const fetchUserStocks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authorization token is missing.');
            setIsLoading(false);
            return;
        }

        const response = await axios.get(`/get/${token}`);
        console.log('API Response:', response.data);

        // Assuming response.data is an array of stocks with `symbol`, `totalInvested`, and `averagePrice`
        const fetchedStocks: Stock[] = response.data.map((stock: any) => ({
          symbol: stock.symbol,
          totalInvested: stock.totalInvested || 0,
          averagePrice: stock.averagePrice || 0,
        }));

        setOwnedStocks(fetchedStocks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user stocks:', error);
        setError('Error fetching user stocks.');
        setIsLoading(false);
      }
    };

    fetchUserStocks();
  }, []);

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  const closeChatbot = () => {
    setChatbotVisible(false);
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-header">
        <h2>
          Today,{' '}
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </h2>
      </div>

      {/* Owned Stocks Section */}
      <div className="owned-stocks">
        <h3>Owned Stocks</h3>
        <div className="cards">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : ownedStocks.length > 0 ? (
            ownedStocks.map((stock, index) => (
              <div key={index} className="card">
                <div className="card-title">{stock.symbol}</div>
                <div className="card-value">Total Invested: ${stock.totalInvested.toFixed(2)}</div>
                <div className="card-value">Price: ${stock.averagePrice.toFixed(2)}</div>
              </div>
            ))
          ) : (
            <p>You don’t own any stocks yet.</p>
          )}
        </div>
      </div>

      <div className="chart-container">
        <Chart />
      </div>
      <button className="chatbot-icon" onClick={toggleChatbot}>
        💬
      </button>
      <Chatbot isVisible={chatbotVisible} onClose={closeChatbot} />
    </div>
  );
};

export default Home;

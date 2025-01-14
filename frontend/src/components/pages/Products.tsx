import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import axios from "../../config/axiosConfig";
import "./Products.css";
import Navbar from "../Home/Navbar";

interface Stock {
  symbol: string;
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
  logo?: string; // Optional property for the logo URL
}

const StockList10: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState("");
  const [prediction, setPrediction] = useState<string | null>(null);
  const [decision, setDecision] = useState<string | null>(null);

  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get("/market/market-summary10");
        if (response.data && Array.isArray(response.data.stocks)) {
          // Fetch logos for each stock symbol
          const stocksWithLogos = await Promise.all(
            response.data.stocks.map(async (stock: Stock) => {
              const logo = await fetchLogo(stock.symbol);
              return { ...stock, logo };
            })
          );
          setStocks(stocksWithLogos);
        } else {
          setError("Invalid response format");
        }
      } catch (error) {
        setError("Error fetching stocks");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const fetchLogo = async (symbol: string): Promise<string> => {
    try {
      const response = await axios.get(`/transactions/logo-get/${symbol}`);
      if (response.data && response.data.logo) {
        return response.data.logo; // Return the logo URL
      } else {
        console.error(`Logo not found for symbol: ${symbol}`);
        return "/default-logo.png"; // Fallback logo
      }
    } catch (error) {
      console.error(`Error fetching logo for symbol ${symbol}:`, error);
      return "/default-logo.png"; // Fallback logo
    }
  };

  const handlePredict = async () => {
    try {
      const response = await axios.post("/lstm/predict", { symbol });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("Error fetching prediction:", error);
    }
  };

  const handleShouldBuy = async () => {
    try {
      const response = await axios.post("/lstm/should_buy", { symbol });
      setDecision(response.data.decision);
    } catch (error) {
      console.error("Error fetching decision:", error);
    }
  };

  const handleBuy = async (symbol: string, price: number) => {
    const quantity = 1;
    const transaction = {
      type: "buy",
      quantity,
      price,
      date: new Date(),
      symbol,
      strategy: "default",
    };

    try {
      const response = await axios.post("/transactions/add", transaction);
      alert(`Bought ${quantity} unit(s) of ${symbol} at $${price}`);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes("insufficient funds")) {
          alert("Fonduri insuficiente");
        } else {
          alert("Eroare la cumpărare");
        }
      } else {
        alert("Eroare la cumpărare");
      }
    }
  };

  const handleSell = async (symbol: string, price: number) => {
    const quantity = 1;
    const transaction = {
      type: "sell",
      quantity,
      price,
      date: new Date(),
      symbol,
      strategy: "default",
    };

    try {
      const response = await axios.post("/transactions/add", transaction);
      alert(`Sold ${quantity} unit(s) of ${symbol} at $${price}`);
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes("insufficient stock")) {
          alert("Stoc insuficient");
        } else {
          alert("Eroare la vânzare");
        }
      } else {
        alert("Eroare la vânzare");
      }
    }
  };

  const handleRedirectToInvest = (stock: Stock) => {
    navigate("/invest", { state: { stock } }); // Redirect to Invest page with stock data
  };

  return (
    <div className="stock-list-container">
      <Navbar />
      <div className="stock-list-content">
        <div className="stock-input-box">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol"
          />
          <div className="buttons-container">
            <button onClick={handlePredict}>Predict</button>
            <button onClick={handleShouldBuy}>Should Buy</button>
          </div>
          {prediction && <div className="result-message">Prediction: {prediction}</div>}
          {decision && <div className="result-message">Decision: {decision}</div>}
        </div>
        {isLoading ? (
          <p>Loading stocks...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="stock-list">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="stock-item" onClick={() => handleRedirectToInvest(stock)}>
                <div className="stock-header">
                  <img
                    src={stock.logo || "/default-logo.png"}
                    alt={`${stock.symbol} logo`}
                    className="stock-logo"
                  />
                  <h2>{stock.symbol}</h2>
                </div>
                <div className="stock-details">
                  <div className="stock-label">Current Price:</div>
                  <div className="stock-value">${stock.currentPrice}</div>
                </div>
                <div className="stock-buttons">
                  <button
                    className="buy-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuy(stock.symbol, stock.currentPrice);
                    }}
                  >
                    Buy
                  </button>
                  <button
                    className="sell-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSell(stock.symbol, stock.currentPrice);
                    }}
                  >
                    Sell
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockList10;

import React, { useState, useEffect } from "react";
import axios from "../config/axiosConfig";
import "./Invest1.css";
import Chatbot from "./Chatbot";
import Navbar from "../components/Home/Navbar";

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  image?: string;
}

const Invest: React.FC = () => {
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("market");
  const [timeInForce, setTimeInForce] = useState("GTC");
  const [estimatedCost, setEstimatedCost] = useState(0);

  const toggleChatbot = () => {
    setChatbotVisible(!chatbotVisible);
  };

  useEffect(() => {
    if (selectedStock) {
      setEstimatedCost(selectedStock.currentPrice * quantity);
    }
  }, [selectedStock, quantity]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/stocks/search?query=${searchQuery}`);
      setStocks(response.data.stocks || []);
    } catch (error) {
      console.error("Error fetching stocks:", error);
    }
  };

  const handleBuy = async () => {
    if (!selectedStock) return alert("Please select a stock to buy.");

    const transaction = {
      type: "buy",
      quantity,
      price: selectedStock.currentPrice,
      date: new Date(),
      symbol: selectedStock.symbol,
      strategy: "default",
    };

    try {
      const response = await axios.post("/transactions/add", transaction);
      alert(`Bought ${quantity} unit(s) of ${selectedStock.symbol} at $${selectedStock.currentPrice}`);
    } catch (error: any) {
      if (error.response?.data?.message?.includes("insufficient funds")) {
        alert("Insufficient funds");
      } else {
        alert("Error completing purchase");
      }
    }
  };

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
  };

  return (
    <div className="invest-root">
      <Navbar />
      <main>
        <section className="intro">
          <h1>Buy and sell stocks</h1>
          <p>Trade your favorite companies, ETFs, and cryptocurrencies.</p>
          <label className="search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g., AAPL, TSLA"
            />
            <button onClick={handleSearch}>Search</button>
          </label>
        </section>

        {/* Stocks Section */}
        <section className="stocks">
          <h2>Stocks and ETFs</h2>
          {stocks.length === 0 ? (
            <p>No stocks found. Try a different query.</p>
          ) : (
            <div className="stock-list">
              {stocks.map((stock) => (
                <div
                  key={stock.symbol}
                  className={`stock-card ${
                    selectedStock?.symbol === stock.symbol ? "selected" : ""
                  }`}
                  onClick={() => handleSelectStock(stock)}
                >
                  <div className="stock-details">
                    <div className="stock-image"></div>
                    <div>
                      <p>{stock.name}</p>
                      <span>${stock.currentPrice.toFixed(2)} per share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Order Type Section */}
        <section className="order-type">
          <h2>Order type</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="order"
                value="market"
                checked={orderType === "market"}
                onChange={(e) => setOrderType(e.target.value)}
              />
              Market
            </label>
            <label>
              <input
                type="radio"
                name="order"
                value="limit"
                onChange={(e) => setOrderType(e.target.value)}
              />
              Limit
            </label>
          </div>
        </section>

        {/* Quantity Section */}
        <section className="quantity">
          <h2>Quantity</h2>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            min="1"
          />
        </section>

        {/* Time in Force Section */}
        <section className="time-in-force">
          <h2>Time in force</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="time"
                value="GTC"
                checked={timeInForce === "GTC"}
                onChange={(e) => setTimeInForce(e.target.value)}
              />
              Good till cancel (GTC)
            </label>
            <label>
              <input
                type="radio"
                name="time"
                value="Day"
                onChange={(e) => setTimeInForce(e.target.value)}
              />
              Day
            </label>
          </div>
        </section>

        {/* Estimated Cost Section */}
        <section className="cost">
          <h2>Estimated cost</h2>
          <p>${estimatedCost.toFixed(2)}</p>
          <button onClick={handleBuy} disabled={!selectedStock}>
            Review order
          </button>
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

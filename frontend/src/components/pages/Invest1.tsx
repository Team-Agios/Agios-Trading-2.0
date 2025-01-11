import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Home/Navbar";
import "./Invest1.css";

interface Stock {
  symbol: string;
  name?: string;
  currentPrice: number;
}

const Invest: React.FC = () => {
  const location = useLocation();
  const stock = location.state?.stock as Stock | undefined;

  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [quantity, setQuantity] = useState(1);
  const [limitPrice, setLimitPrice] = useState(stock?.currentPrice || 0);
  const [estimatedCost, setEstimatedCost] = useState(0);

  useEffect(() => {
    // Update estimated cost based on order type
    if (orderType === "market") {
      setEstimatedCost(quantity * (stock?.currentPrice || 0));
    } else if (orderType === "limit") {
      setEstimatedCost(quantity * limitPrice);
    }
  }, [quantity, limitPrice, orderType, stock]);

  const handleBuy = async () => {
    if (!stock) return alert("No stock selected.");

    const price = orderType === "market" ? stock.currentPrice : limitPrice;

    const transaction = {
      type: "buy",
      quantity,
      price,
      date: new Date(),
      symbol: stock.symbol,
      strategy: orderType,
    };

    try {
      alert(`Buying ${quantity} unit(s) of ${stock.symbol} at $${price.toFixed(2)}`);
    } catch (error) {
      alert("Error completing purchase.");
    }
  };

  if (!stock) {
    return (
      <div>
        <Navbar />
        <h1>No stock selected</h1>
      </div>
    );
  }

  return (
    <div className="invest-root">
      <Navbar />
      <main>
        <h1>Invest in {stock.symbol}</h1>
        <p>Current Price: ${stock.currentPrice.toFixed(2)}</p>

        {/* Order Type Section */}
        <section className="order-type">
          <h2>Order Type</h2>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="order"
                value="market"
                checked={orderType === "market"}
                onChange={(e) => setOrderType(e.target.value as "market")}
              />
              Market
            </label>
            <label>
              <input
                type="radio"
                name="order"
                value="limit"
                checked={orderType === "limit"}
                onChange={(e) => setOrderType(e.target.value as "limit")}
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

        {/* Limit Price Section */}
        {orderType === "limit" && (
          <section className="limit-price">
            <h2>Limit Price</h2>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
              min="0"
            />
          </section>
        )}

        {/* Estimated Cost Section */}
        <section className="cost">
          <h2>Estimated Cost</h2>
          <p>${estimatedCost.toFixed(2)}</p>
          <button onClick={handleBuy}>Buy</button>
        </section>
      </main>
    </div>
  );
};

export default Invest;

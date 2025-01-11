import React, { useEffect, useState } from "react";
import axios from "../../config/axiosConfig";
import Navbar from "../Home/Navbar"; // Ajustăm calea
import "./BusinessNews.css";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: {
    name: string;
  };
}

const BusinessNews: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketNews = async () => {
      try {
        const response = await axios.get("/market/market-news");
        setNews(response.data.news);
        setIsLoading(false);
      } catch (error) {
        setError("Error fetching market news");
        setIsLoading(false);
      }
    };

    fetchMarketNews();
  }, []);

  const handleArticleClick = (url: string) => {
    window.open(url, "_blank"); // Deschidem articolul într-o filă nouă
  };

  return (
    <div className="business-news-container">
      <Navbar />
      <div className="news-content">
        <div className="news-header">
          <h2>Business News</h2>
        </div>
        <div className="news-scroll-container">
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            news.map((article, index) => (
              <div
                key={index}
                className="news-article"
                onClick={() => handleArticleClick(article.url)}
              >
                <img
                  src="https://via.placeholder.com/300x150" // Placeholder pentru imagini
                  alt={article.title}
                />
                <h4>{article.title}</h4>
                <p>{article.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessNews;

import React, { useEffect, useState } from 'react';
import axios from '../../config/axiosConfig';
import Navbar from '../Home/Navbar';
import './Transactions.css';

interface Transaction {
    _id: string;
    type: string;
    quantity: number;
    price: number;
    date: string;
    symbol: string;
    strategy: string;
    logo?: string; // Optional property for the logo URL
}

const Transactions: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const response = await axios.post('/transactions/get', null, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Response data:', response.data); // Log the response data
                if (response.data && Array.isArray(response.data.transactions)) {
                    console.log('Transactions:', response.data.transactions); // Log the transactions

                    // Fetch logos for each transaction
                    const transactionsWithLogos = await Promise.all(
                        response.data.transactions.map(async (transaction: Transaction) => {
                            const logoUrl = await fetchLogo(transaction.symbol);
                            return { ...transaction, logo: logoUrl };
                        })
                    );

                    setTransactions(transactionsWithLogos);
                } else {
                    console.error('Invalid response format:', response.data); // Log invalid format
                    setError('No transactions found...');
                }
            } else {
                setError('No transactions found...');
            }
        } catch (error) {
            console.error('Error fetching transactions:', error); // Log any errors
            setError('No transactions found...');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLogo = async (symbol: string): Promise<string> => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const response = await axios.get(`/logo/get/${symbol}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.data && response.data.logoUrl) {
                    return response.data.logoUrl;
                } else {
                    console.error('Logo not found for symbol:', symbol);
                    return '/default-logo.png'; // Fallback logo
                }
            } else {
                console.error('Token not available');
                return '/default-logo.png';
            }
        } catch (error) {
            console.error('Error fetching logo:', error);
            return '/default-logo.png'; // Fallback logo
        }
    };

    const fetchBalance = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const response = await axios.get('/balance/get', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('Current balance:', response.data);
                if (response.data && typeof response.data.balance === 'number') {
                    setBalance(response.data.balance);
                } else {
                    console.error('Invalid balance format:', response.data);
                    setBalance(0); 
                }
            } else {
                setBalance(0); 
            }
        } catch (error) {
            console.error('Error fetching balance', error);
            setBalance(0); 
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchBalance();
    }, []);

    return (
        <div className="transaction-list-container">
            <Navbar />
            <div className="transaction-list-content">
                <h1>Transactions</h1>
                {isLoading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="transaction-list">
                        {transactions.map(transaction => (
                            <div key={transaction._id} className="transaction-item">
                                <div className="transaction-header">
                                    <img
                                        src={transaction.logo || '/default-logo.png'}
                                        alt={`${transaction.symbol} logo`}
                                        className="transaction-logo"
                                    />
                                    <h2>Transaction ID: {transaction._id}</h2>
                                </div>
                                <div className="transaction-details">
                                    <div className="transaction-row">
                                        <span className="transaction-label">Type:</span>
                                        <span className="transaction-value">{transaction.type}</span>
                                    </div>
                                    <div className="transaction-row">
                                        <span className="transaction-label">Quantity:</span>
                                        <span className="transaction-value">{transaction.quantity}</span>
                                    </div>
                                    <div className="transaction-row">
                                        <span className="transaction-label">Price:</span>
                                        <span className="transaction-value">${transaction.price.toFixed(2)}</span>
                                    </div>
                                    <div className="transaction-row">
                                        <span className="transaction-label">Date:</span>
                                        <span className="transaction-value">{new Date(transaction.date).toLocaleString()}</span>
                                    </div>
                                    <div className="transaction-row">
                                        <span className="transaction-label">Symbol:</span>
                                        <span className="transaction-value">{transaction.symbol}</span>
                                    </div>
                                    <div className="transaction-row">
                                        <span className="transaction-label">Strategy:</span>
                                        <span className="transaction-value">{transaction.strategy}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;

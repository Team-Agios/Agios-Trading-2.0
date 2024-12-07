import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Chart.css';

interface Dataset {
    label: string;
    data: number[];
}

interface GraphResponse {
    labels: string[];
    datasets: Dataset[];
}

interface ProcessedData {
    symbol: string;
    labels: string[];
    totalInvested: number[];
    averagePrice: number[];
}

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const Chart = () => {
    const [graphData, setGraphData] = useState<GraphResponse | null>(null);
    const [processedData, setProcessedData] = useState<ProcessedData[]>([]);
    const [mode, setMode] = useState<string>('week');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchGraphData = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('Authorization token is missing.');
                setIsLoading(false);
                return;
            }

            const response = await axios.get(`http://localhost:5869/api/portfolio/portfolio-graph`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { mode },
            });

            console.log('Graph Data Response:', response.data);
            setGraphData(response.data);
            setError(null);
        } catch (error: any) {
            console.error('Error fetching graph data:', error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to fetch graph data.');
        } finally {
            setIsLoading(false);
        }
    }, [mode]);

    const processGraphData = useCallback((data: GraphResponse) => {
        const { labels, datasets } = data;

        const transformedData = labels.map((label: string, index: number) => {
            return {
                symbol: label,
                labels: datasets[0]?.data.map((_: number, i: number) => `Day ${i + 1}`),
                totalInvested: datasets[0]?.data,
                averagePrice: datasets[1]?.data,
            };
        });

        setProcessedData(transformedData);
    }, []);

    useEffect(() => {
        fetchGraphData();
    }, [fetchGraphData]);

    useEffect(() => {
        if (graphData) {
            processGraphData(graphData);
        }
    }, [graphData, processGraphData]);

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h1>Portfolio Graphs</h1>
                <div className="chart-buttons">
                    <button
                        className={mode === 'week' ? 'active' : ''}
                        onClick={() => setMode('week')}
                    >
                        Week
                    </button>
                    <button
                        className={mode === 'month' ? 'active' : ''}
                        onClick={() => setMode('month')}
                    >
                        Month
                    </button>
                    <button
                        className={mode === 'year' ? 'active' : ''}
                        onClick={() => setMode('year')}
                    >
                        Year
                    </button>
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            {isLoading ? (
                <div>Loading graphs...</div>
            ) : processedData && processedData.length > 0 ? (
                <div className="chart-content">
                    {processedData.map((data, index) => (
                        <div key={index} className="chart-item minimalist">
                            <h3>{data.symbol}</h3>
                            <Line
                                data={{
                                    labels: data.labels,
                                    datasets: [
                                        {
                                            label: 'Total Invested',
                                            data: data.totalInvested,
                                            borderColor: '#358ef3', // Albastru deschis
                                            backgroundColor: 'rgba(53, 142, 243, 0.2)', // Albastru transparent
                                            borderWidth: 2,
                                            pointRadius: 0,
                                            tension: 0.4,
                                        },
                                        {
                                            label: 'Average Price',
                                            data: data.averagePrice,
                                            borderColor: '#90abcb', // Gri-albăstrui
                                            backgroundColor: 'rgba(144, 171, 203, 0.2)', // Gri-albăstrui transparent
                                            borderWidth: 2,
                                            pointRadius: 0,
                                            tension: 0.4,
                                        },
                                    ],
                                }}
                                options={{
                                    maintainAspectRatio: false,
                                    plugins: {
                                        tooltip: {
                                            enabled: true,
                                            backgroundColor: '#223449', // Fundal întunecat pentru tooltip
                                            titleColor: '#ffffff', // Titlul tooltip-ului alb
                                            bodyColor: '#ffffff', // Textul tooltip-ului alb
                                        },
                                        legend: {
                                            display: true,
                                            labels: {
                                                color: '#e5e7e6', // Alb pentru textul legendei
                                            },
                                        },
                                    },
                                    scales: {
                                        x: {
                                            display: true,
                                            grid: {
                                                display: false, // Ascunde liniile grilei pe axa X
                                            },
                                            ticks: {
                                                color: '#e5e7e6', // Alb pentru etichetele axei X
                                            },
                                        },
                                        y: {
                                            display: true,
                                            grid: {
                                                display: true,
                                                color: '#314b68', // Gri-albăstrui pentru liniile grilei
                                            },
                                            ticks: {
                                                color: '#e5e7e6', // Alb pentru etichetele axei Y
                                            },
                                        },
                                    },
                                }}
                            />

                        </div>
                    ))}
                </div>
            ) : (
                <div>No data available.</div>
            )}
        </div>
    );
};

export default Chart;

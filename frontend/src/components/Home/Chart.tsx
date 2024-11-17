import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './Chart.css';

interface GraphData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
    }[];
}

// Înregistrăm scale-urile
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Chart = () => {
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [mode, setMode] = useState('week');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchGraphData = async (mode: string) => {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const response = await axios.get(`http://localhost:5869/api/portfolio/portfolio-graph`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        mode: mode,
                    },
                });
                if (response.data && response.data.labels && response.data.datasets) {
                    setGraphData(response.data);
                } else {
                    setError('No transactions found...');
                }
            } else {
                setError('No transactions found...');
            }
        } catch (error) {
            console.error('No transactions found...');
            setError('No transactions found...');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;
        fetchGraphData(mode).then(() => {
            if (isMounted) setIsLoading(false);
        });
        return () => {
            isMounted = false;
        };
    }, [mode]);

    return (
        <div className="chart-container">
            <div className="chart-header">
                <h1>Portfolio Graph</h1>
                <div className="chart-buttons">
                    <button className={mode === 'week' ? 'active' : ''} onClick={() => setMode('week')}>Week</button>
                    <button className={mode === 'month' ? 'active' : ''} onClick={() => setMode('month')}>Month</button>
                    <button className={mode === 'year' ? 'active' : ''} onClick={() => setMode('year')}>Year</button>
                </div>
            </div>
            {error && <div className="error">{error}</div>}
            {isLoading ? (
                <div>No transactions found...</div>
            ) : (
                <div className="chart-content">
                    {graphData && (
                        <Line
    data={{
        labels: graphData.labels,
        datasets: graphData.datasets.map((dataset, index) => ({
            ...dataset,
            borderColor: index === 0 ? '#f02d3a' : index === 1 ? '#8ac926' : '#8ac926', // Culori diferite pentru fiecare linie
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Fundal translucid
        })),
    }}
    options={{
        maintainAspectRatio: false,
        scales: {
            x: {
                ticks: { color: '#000' }, // Culoare pentru etichetele axei X
            },
            y: {
                ticks: { color: '#000' }, // Culoare pentru etichetele axei Y
            },
        },
        plugins: {
            legend: {
                labels: {
                    color: '#000', // Text de legendă în culoare închisă
                },
            },
        },
    }}
/>

                    )}
                </div>
            )}
        </div>
    );
};

export default Chart;

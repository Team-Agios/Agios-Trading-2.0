import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Home from './pages/Home';
import Profile from './pages/Profile';
import BusinessNews from './pages/BusinessNews';
import StockList10 from './pages/Products';
import Transactions from './pages/Transactions';
import Balance from './pages/Balance';
import Chatbot from './pages/Chatbot';
import Otp from './components/Auth/Otp';
import Verify from './components/Auth/Verify';
import ActivityPage from './pages/ActivityPage';
import Invest from './pages/Invest1';
import DepositFunds from './pages/DepositFunds';
import './App.css';

// Definirea rutelor
const routes = [
  { path: "/", element: <Login /> },
  { path: "/login/:userId?", element: <Login /> },
  { path: "/register/:referralCode?", element: <Register /> },
  { path: "/verify/:token", element: <Verify /> },
  { path: "/forgot-password/:token?", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/home", element: <Home /> },
  { path: "/profile", element: <Profile /> },
  { path: "/news", element: <BusinessNews /> },
  { path: "/stocks", element: <StockList10 /> },
  { path: "/transactions", element: <Transactions /> },
  { path: "/balance", element: <Balance /> },
  { path: "/chatbot", element: <Chatbot /> },
  { path: "/otp", element: <Otp /> },
  {path :"/activity", element: <ActivityPage/>},
  {path:"/depozit",element:<DepositFunds/>},
  {path:"/invest",element:<Invest/>},
];

const router = createBrowserRouter(routes, {
  future: {
    // @ts-ignore
    v7_startTransition: true,
    // @ts-ignore
    v7_fetcherPersist: true,
    // @ts-ignore
    v7_normalizeFormMethod: true,
    // @ts-ignore
    v7_partialHydration: true,
    // @ts-ignore
    v7_skipActionRevalidation: true,
  },
});


const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;

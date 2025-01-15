import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Home from './components/pages/Home';
import Profile from './components/pages/Profile';
import BusinessNews from './components/pages/BusinessNews';
import StockList10 from './components/pages/Products';
import Transactions from './components/pages/Transactions';
import Balance from './components/pages/Balance';
import Chatbot from './components/pages/Chatbot';
import Otp from './components/Auth/Otp';
import Verify from './components/Auth/Verify';
import ActivityPage from './components/pages/ActivityPage';
import Invest from './components/pages/Invest1';
import DepositFunds from './components/pages/DepositFunds';
import './App.css';
import AgiosTradingPresentation from './components/Presentation/Presentation';
import OtpReset from './components/Auth/OtpReset';

// Definirea rutelor
const routes = [
  { path: "/", element: <AgiosTradingPresentation /> },
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
  { path: "/otpreset", element: <OtpReset /> },
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

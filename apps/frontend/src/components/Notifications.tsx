
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  return <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />;
};

export default Notifications;

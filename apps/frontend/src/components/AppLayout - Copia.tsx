import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import RadioPlayer from "@/components/widgets/RadioPlayer";
import TopbarLayout from './TopbarLayout';

const AppLayout = () => {
  const [showRadio, setShowRadio] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-red-100">
      <Header />
      <TopbarLayout toggleRadio={() => setShowRadio(prev => !prev)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
      {showRadio && <RadioPlayer />}
    </div>
  );
};

export default AppLayout;
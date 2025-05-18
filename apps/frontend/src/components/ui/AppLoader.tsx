import React from 'react';

const AppLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <img src="/icon.png" alt="Brickly" className="h-16 w-16 mb-4" />
      <span className="text-blue-700 font-medium text-lg">Caricamento in corso...</span>
    </div>
  );
};

export default AppLoader;

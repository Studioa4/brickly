import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img src="/icon.png" alt="Brickly" className="h-12 w-12 mb-2" />
      <span className="text-blue-700 font-medium text-lg">Caricamento...</span>
    </div>
  );
};

export default Loader;

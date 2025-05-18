import React from "react";
import RequireAuth from "../components/RequireAuth";

const Situazionepatrimoniale = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Situazione patrimoniale</div>
    </RequireAuth>
  );
};

export default Situazionepatrimoniale;

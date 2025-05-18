import React from "react";
import RequireAuth from "../components/RequireAuth";

const Esercizi = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Esercizi</div>
    </RequireAuth>
  );
};

export default Esercizi;

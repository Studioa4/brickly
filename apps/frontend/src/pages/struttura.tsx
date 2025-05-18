import React from "react";
import RequireAuth from "../components/RequireAuth";

const Struttura = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Struttura</div>
    </RequireAuth>
  );
};

export default Struttura;

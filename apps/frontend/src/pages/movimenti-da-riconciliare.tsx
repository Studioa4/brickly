import React from "react";
import RequireAuth from "../components/RequireAuth";

const Movimentidariconciliare = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Movimenti da riconciliare</div>
    </RequireAuth>
  );
};

export default Movimentidariconciliare;

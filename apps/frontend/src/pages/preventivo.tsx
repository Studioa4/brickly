import React from "react";
import RequireAuth from "../components/RequireAuth";

const Preventivo = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Preventivo</div>
    </RequireAuth>
  );
};

export default Preventivo;

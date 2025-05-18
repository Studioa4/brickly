import React from "react";
import RequireAuth from "../components/RequireAuth";

const Scadenzario = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Scadenzario</div>
    </RequireAuth>
  );
};

export default Scadenzario;

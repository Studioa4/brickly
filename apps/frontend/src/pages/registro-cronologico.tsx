import React from "react";
import RequireAuth from "../components/RequireAuth";

const Registrocronologico = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Registro cronologico</div>
    </RequireAuth>
  );
};

export default Registrocronologico;

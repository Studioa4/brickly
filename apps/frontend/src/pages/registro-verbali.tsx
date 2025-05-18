import React from "react";
import RequireAuth from "../components/RequireAuth";

const Registroverbali = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Registro verbali</div>
    </RequireAuth>
  );
};

export default Registroverbali;

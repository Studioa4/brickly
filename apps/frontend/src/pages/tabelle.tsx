import React from "react";
import RequireAuth from "../components/RequireAuth";

const Tabelle = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Tabelle</div>
    </RequireAuth>
  );
};

export default Tabelle;

import React from "react";
import RequireAuth from "../components/RequireAuth";

const Tabellefiscali = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Tabelle fiscali</div>
    </RequireAuth>
  );
};

export default Tabellefiscali;

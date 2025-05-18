import React from "react";
import RequireAuth from "../components/RequireAuth";

const Datigenerali = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Dati generali</div>
    </RequireAuth>
  );
};

export default Datigenerali;

import React from "react";
import RequireAuth from "../components/RequireAuth";

const Unitàimmobiliari = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Unità immobiliari</div>
    </RequireAuth>
  );
};

export default Unitàimmobiliari;

import React from "react";
import RequireAuth from "../components/RequireAuth";

const Ripartospese = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Riparto spese</div>
    </RequireAuth>
  );
};

export default Ripartospese;

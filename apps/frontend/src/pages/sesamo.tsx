import React from "react";
import RequireAuth from "../components/RequireAuth";

const Sesamo = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Sesamo</div>
    </RequireAuth>
  );
};

export default Sesamo;

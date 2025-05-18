import React from "react";
import RequireAuth from "../components/RequireAuth";

const Fatturazione = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Fatturazione</div>
    </RequireAuth>
  );
};

export default Fatturazione;

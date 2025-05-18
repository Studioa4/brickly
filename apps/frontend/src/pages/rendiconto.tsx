import React from "react";
import RequireAuth from "../components/RequireAuth";

const Rendiconto = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Rendiconto</div>
    </RequireAuth>
  );
};

export default Rendiconto;

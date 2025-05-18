import React from "react";
import RequireAuth from "../components/RequireAuth";

const Contatori = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Contatori</div>
    </RequireAuth>
  );
};

export default Contatori;

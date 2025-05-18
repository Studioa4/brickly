import React from "react";
import RequireAuth from "../components/RequireAuth";

const Impianti = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Impianti</div>
    </RequireAuth>
  );
};

export default Impianti;

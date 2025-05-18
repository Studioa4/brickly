import React from "react";
import RequireAuth from "../components/RequireAuth";

const Pianidirientro = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Piani di rientro</div>
    </RequireAuth>
  );
};

export default Pianidirientro;

import React from "react";
import RequireAuth from "../components/RequireAuth";

const Preventivoindividuale = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Preventivo individuale</div>
    </RequireAuth>
  );
};

export default Preventivoindividuale;

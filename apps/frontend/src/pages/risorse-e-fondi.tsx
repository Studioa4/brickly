import React from "react";
import RequireAuth from "../components/RequireAuth";

const Risorseefondi = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Risorse e fondi</div>
    </RequireAuth>
  );
};

export default Risorseefondi;

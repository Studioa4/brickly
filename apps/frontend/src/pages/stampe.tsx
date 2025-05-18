import React from "react";
import RequireAuth from "../components/RequireAuth";

const Stampe = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Stampe</div>
    </RequireAuth>
  );
};

export default Stampe;

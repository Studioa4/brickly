import React from "react";
import RequireAuth from "../components/RequireAuth";

const Registroanagrafe = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Registro anagrafe</div>
    </RequireAuth>
  );
};

export default Registroanagrafe;

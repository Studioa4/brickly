import React from "react";
import RequireAuth from "../components/RequireAuth";

const Whatsapp = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Whatsapp</div>
    </RequireAuth>
  );
};

export default Whatsapp;

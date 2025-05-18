import React from "react";
import RequireAuth from "../components/RequireAuth";

const Catasto = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Catasto</div>
    </RequireAuth>
  );
};

export default Catasto;

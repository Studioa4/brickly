import React from "react";
import RequireAuth from "../components/RequireAuth";

const QuadroACK = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Quadro AC / K</div>
    </RequireAuth>
  );
};

export default QuadroACK;

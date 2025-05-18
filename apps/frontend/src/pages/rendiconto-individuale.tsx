import React from "react";
import RequireAuth from "../components/RequireAuth";

const Rendicontoindividuale = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Rendiconto individuale</div>
    </RequireAuth>
  );
};

export default Rendicontoindividuale;

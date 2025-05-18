import React from "react";
import RequireAuth from "../components/RequireAuth";

const Anagrafiche = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Anagrafiche</div>
    </RequireAuth>
  );
};

export default Anagrafiche;

import React from "react";
import RequireAuth from "../components/RequireAuth";

const Email = () => {
  return (
    <RequireAuth>
      <div className="p-6 text-xl font-bold">Brickly – Email</div>
    </RequireAuth>
  );
};

export default Email;

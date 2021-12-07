import React from "react";

function Container({ children }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

export default Container;

import React from "react";

function Container({ children }) {
  return (
    <div
      style={{
        width: "90%",
        maxWidth: "760",
        margin: "1.5rem auto 0 auto",
      }}
    >
      {children}
    </div>
  );
}

export default Container;

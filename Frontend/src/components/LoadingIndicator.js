import React from "react";

function LoadingIndicator({ isLoading, children }) {
  return isLoading ? (
    <div>
      <img
        alt="Loading..."
        src="https://i.pinimg.com/originals/ce/ca/e6/cecae62ec79ddc1d9d95c3131510f3e6.gif"
        height="280px"
      />
    </div>
  ) : (
    <div>{children}</div>
  );
}

export default LoadingIndicator;

import React from "react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <img
        className="w-16 h-16 object-contain"
        src="spinner.svg"
        alt="Loading..."
      />
    </div>
  );
}

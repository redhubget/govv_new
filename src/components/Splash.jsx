import React from "react";

export default function Splash() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="text-center">
        <img
          src="/govv-logo.png"
          alt="GoVV Logo"
          className="w-32 h-32 mx-auto animate-bounce"
        />
        <h1 className="mt-4 text-3xl font-bold text-gray-800">Go VV</h1>
        <p className="text-gray-500">Ride the Future 🚴⚡</p>
      </div>
    </div>
  );
}



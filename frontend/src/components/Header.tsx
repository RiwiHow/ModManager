import { useState, useEffect } from "react";

export default function Header() {
  const [backendStatus, setBackendStatus] = useState(false);

  useEffect(() => {
    const checkBackendStatus = () => {
      fetch("http://localhost:8000/api/test")
        .then((response) => response.json())
        .then(() => setBackendStatus(true))
        .catch(() => setBackendStatus(false));
    };

    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div className="ml-4 py-4">
        <h1 className="header-1 inline-block">Mod Manager</h1>
        <div
          className={`ml-2 inline-block h-3 w-3 rounded-full ${
            backendStatus ? "animate-pulse bg-green-500" : "bg-red-500"
          }`}
        />
        <p className="mt-1 text-sm text-gray-600">
          Backend status: {backendStatus ? "Connected!" : "Not connected!"}
        </p>
      </div>
    </header>
  );
}

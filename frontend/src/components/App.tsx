import { useState, useEffect } from "react";
// import GamePathSelector from "./GamePathSelector";
import ShowInstalledGame from "./ShowInstalledGame";

function App() {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl ml-4 py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-800">Mod Manager</h1>
            <div
              className={`w-3 h-3 rounded-full ${
                backendStatus ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Backend status: {backendStatus ? "Connected!" : "Not connected!"}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <ShowInstalledGame />
      </main>
    </div>
  );
}

export default App;

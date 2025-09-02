import { useState, useEffect } from "react";
import GamePathSelector from "./GamePathSelector";

function App() {
  const [backendStatus, setBackendStatus] = useState("Checking connection...");

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then((response) => response.json())
      .then((data) => setBackendStatus(data.message))
      .catch((error) => setBackendStatus(`Error: ${error.message}`));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Mod Manager</h1>
          <p className="text-sm text-gray-600 mt-1">
            Backend status: {backendStatus}
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <GamePathSelector />
      </main>
    </div>
  );
}

export default App;

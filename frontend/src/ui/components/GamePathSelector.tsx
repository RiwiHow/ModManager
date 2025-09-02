import { useState, useEffect } from "react";

type Game = {
  id: number;
  name: string;
  path: string;
};

// Add types for the Electron API exposed through preload
declare global {
  interface Window {
    api?: {
      selectDirectory: () => Promise<string | null>;
      getAppVersion: () => Promise<string>;
    };
  }
}

function GamePathSelector() {
  const [games, setGames] = useState<Game[]>([]);
  const [newGameName, setNewGameName] = useState("");
  const [newGamePath, setNewGamePath] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/games");
      if (!response.ok) {
        throw new Error(`Error fetching games: ${response.statusText}`);
      }
      const data = await response.json();
      setGames(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName || !newGamePath) {
      setError("Please enter both game name and path");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newGameName,
          path: newGamePath,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error adding game: ${response.statusText}`);
      }

      // Clear form and refresh list
      setNewGameName("");
      setNewGamePath("");
      await fetchGames();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGamePath = async () => {
    // Use Electron dialog to select a directory through our preload API
    if (window.api?.selectDirectory) {
      const selectedPath = await window.api.selectDirectory();
      if (selectedPath) {
        setNewGamePath(selectedPath);
      }
    } else {
      // Fallback for when running in browser dev mode without Electron
      alert("Directory selection is only available in the desktop app");
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-5">
        Manage Game Paths
      </h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 mb-5">
        <h3 className="text-lg font-medium text-gray-700 mb-4">
          Configured Games
        </h3>
        {isLoading && <p className="text-gray-600">Loading...</p>}
        {games.length === 0 && !isLoading ? (
          <p className="text-gray-600">
            No games configured yet. Add your first game below.
          </p>
        ) : (
          <ul className="space-y-0">
            {games.map((game) => (
              <li
                key={game.id}
                className="py-3 border-b border-gray-200 last:border-b-0"
              >
                <strong className="text-gray-800">{game.name}</strong>
                <span className="text-gray-600">: {game.path}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={handleAddGame} className="bg-gray-50 rounded-lg p-5">
        <h3 className="text-lg font-medium text-gray-700 mb-4">Add New Game</h3>

        <div className="mb-4">
          <label
            htmlFor="gameName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Game Name:
          </label>
          <input
            type="text"
            id="gameName"
            value={newGameName}
            onChange={(e) => setNewGameName(e.target.value)}
            placeholder="e.g., Skyrim"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="gamePath"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Game Path:
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              id="gamePath"
              value={newGamePath}
              onChange={(e) => setNewGamePath(e.target.value)}
              placeholder="C:\Games\Skyrim"
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleSelectGamePath}
              className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors whitespace-nowrap"
            >
              Browse...
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="mt-3 px-5 py-2.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Adding..." : "Add Game"}
        </button>
      </form>
    </div>
  );
}

export default GamePathSelector;

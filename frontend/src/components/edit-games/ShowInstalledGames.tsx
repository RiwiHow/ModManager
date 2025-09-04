import { useState, useEffect } from "react";

type Game = {
  id: number;
  name: string;
  path: string;
};

export default function ShowInstalledGame() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchGames() {
    setIsLoading(true);
    setError("");
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
  }

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        Configured Games
      </h3>
      {isLoading && <p className="text-gray-600">Loading...</p>}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

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
  );
}

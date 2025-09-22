import { useEffect, useState } from "react";
import AddGamePath from "./AddGamePath";
import type { Game } from "./ShowInstalledGames";
import ShowInstalledGame from "./ShowInstalledGames";

interface ConfigGamesProps {
  onNavigateToMods: (game: Game) => void;
}

export default function ConfigGames({ onNavigateToMods }: ConfigGamesProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchGames() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/games/list");
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
    <main className="m-8 flex flex-col p-8">
      <ShowInstalledGame
        games={games}
        isLoading={isLoading}
        error={error}
        onGameDeleted={fetchGames}
        onManageMods={onNavigateToMods}
      />
      <AddGamePath onGameAdded={fetchGames} />
    </main>
  );
}

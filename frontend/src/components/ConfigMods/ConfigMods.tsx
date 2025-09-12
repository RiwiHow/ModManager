import { useState, useEffect, useCallback } from "react";
import type { Game } from "../ConfigGames/ShowInstalledGames";
import Button from "../../ui/Button";
import { ShowInstalledMods } from "./ShowInstalledMods";

export type Mod = {
  id: number;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  gameId: number;
};

interface ConfigModsProps {
  onBackToGames: () => void;
  selectedGame: Game | null;
}

export default function ConfigMods({
  onBackToGames,
  selectedGame,
}: ConfigModsProps) {
  const [mods, setMods] = useState<Mod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMods = useCallback(async () => {
    if (!selectedGame?.id) {
      setMods([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/games/${selectedGame.id}/mods`,
      );
      if (!response.ok) {
        throw new Error(`Error fetching mods: ${response.status}`);
      }

      const data = await response.json();
      setMods(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  }, [selectedGame?.id]);

  useEffect(() => {
    fetchMods();
  }, [fetchMods]);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Button onClick={onBackToGames} variant="back">
          Back to Games
        </Button>
      </div>

      <div className="mb-6">
        <p className="header-2">
          {selectedGame
            ? `Manage mods for ${selectedGame.name}`
            : "Manage and configure your game modifications"}
        </p>
        {selectedGame && (
          <p className="sub-normal-text">Game Path: {selectedGame.path}</p>
        )}
      </div>

      {isLoading && (
        <div className="py-8 text-center">
          <p className="normal-text">Loading mods...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 rounded border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="rounded-md bg-white shadow-sm">
          {mods.length === 0 ? (
            <div className="p-8 text-center">
              <p className="sub-normal-text">No mods installed yet.</p>
            </div>
          ) : (
            <ShowInstalledMods mods={mods} />
          )}
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-6">
          <Button variant="install">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Install New Mod
          </Button>
        </div>
      )}
    </div>
  );
}

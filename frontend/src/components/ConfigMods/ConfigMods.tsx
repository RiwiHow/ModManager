import { useState, useEffect, useCallback } from "react";
import type { Game } from "../ConfigGames/ShowInstalledGames";
import Button from "../../ui/Button";
import { ShowInstalledMods } from "./ShowInstalledMods";
import InstallMod from "./InstallMod";

export type Mod = {
  id: number;
  name: string;
  description: string;
  version: string;
  enabled: number;
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
  const [showInstallMod, setShowInstallMod] = useState(false);

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
        `http://localhost:8000/api/games/${selectedGame.id}/mods/list`,
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

  const handleModInstalled = () => {
    setShowInstallMod(false);
    fetchMods();
  };

  const handleCancelInstall = () => {
    setShowInstallMod(false);
  };

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
            <ShowInstalledMods
              mods={mods}
              onModDeleted={fetchMods}
              selectedGame={selectedGame as Game}
            />
          )}
        </div>
      )}

      {!isLoading && !error && (
        <div className="mt-6">
          <Button variant="install" onClick={() => setShowInstallMod(true)}>
            Install New Mod
          </Button>
        </div>
      )}

      {showInstallMod && selectedGame && (
        <InstallMod
          gameId={selectedGame.id}
          onModInstalled={handleModInstalled}
          onCancel={handleCancelInstall}
        />
      )}
    </div>
  );
}

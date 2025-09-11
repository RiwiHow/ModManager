import { useState, useEffect, useCallback } from "react";
import type { Game } from "../ConfigGames/ShowInstalledGames";
import Button from "../../ui/Button";

export type Mod = {
  id: number;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  gameId: number;
};

interface ManageModsProps {
  onBackToGames: () => void;
  selectedGame: Game | null;
}

export default function ManageMods({
  onBackToGames,
  selectedGame,
}: ManageModsProps) {
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

  const toggleModStatus = async (modId: number) => {
    // 这里后续需要调用 API 来切换 mod 状态
    setMods((prevMods) =>
      prevMods.map((mod) =>
        mod.id === modId ? { ...mod, isEnabled: !mod.enabled } : mod,
      ),
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <Button onClick={onBackToGames} variant="back">
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Games
        </Button>
      </div>

      <div className="mb-8">
        <p className="mt-2 text-gray-600">
          {selectedGame
            ? `Manage mods for ${selectedGame.name}`
            : "Manage and configure your game modifications"}
        </p>
        {selectedGame && (
          <p className="mt-1 text-sm text-gray-500">
            Game Path: {selectedGame.path}
          </p>
        )}
      </div>

      {/* 加载状态 */}
      {isLoading && (
        <div className="py-8 text-center">
          <p className="text-gray-600">Loading mods...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="mb-6 rounded border-l-4 border-red-500 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Mod 列表 */}
      {!isLoading && !error && (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {mods.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No mods installed yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {mods.map((mod) => (
                <div key={mod.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {mod.name}
                        </h3>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            mod.enabled
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {mod.enabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>Version: {mod.version}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* 启用/禁用切换 */}
                      <Button
                        onClick={() => toggleModStatus(mod.id)}
                        variant={mod.enabled ? "disable" : "enable"}
                      >
                        {mod.enabled ? "Disable" : "Enable"}
                      </Button>

                      {/* 删除按钮 */}
                      <Button variant="remove">Remove</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 添加 Mod 按钮 */}
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

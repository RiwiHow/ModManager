import { useState, useEffect } from "react";
import type { Game } from "../ConfigGames/ShowInstalledGames";

export type Mod = {
  id: number;
  name: string;
  version: string;
  gameId: number;
  gameName: string;
  isEnabled: boolean;
  installPath: string;
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

  // 模拟获取 Mod 数据 - 后续需要从后端 API 获取
  useEffect(() => {
    const fetchMods = async () => {
      try {
        setIsLoading(true);
        // 这里后续需要调用实际的 API
        // const response = await fetch(`/api/mods?gameId=${selectedGame?.id}`);
        // const data = await response.json();

        // 模拟数据 - 根据选中的游戏过滤
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const allMockMods: Mod[] = [
          {
            id: 1,
            name: "Graphics Enhancement Mod",
            version: "1.2.0",
            gameId: 1,
            gameName: "Game A",
            isEnabled: true,
            installPath: "/path/to/mod1",
          },
          {
            id: 2,
            name: "UI Improvement Pack",
            version: "2.1.5",
            gameId: 1,
            gameName: "Game A",
            isEnabled: false,
            installPath: "/path/to/mod2",
          },
          {
            id: 3,
            name: "Performance Booster",
            version: "3.0.1",
            gameId: 2,
            gameName: "Game B",
            isEnabled: true,
            installPath: "/path/to/mod3",
          },
        ];

        // 根据选中的游戏过滤 Mods
        const filteredMods = selectedGame
          ? allMockMods.filter((mod) => mod.gameId === selectedGame.id)
          : allMockMods;

        setMods(filteredMods);
      } catch {
        setError("Failed to load mods");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMods();
  }, [selectedGame]);
  const toggleModStatus = async (modId: number) => {
    // 这里后续需要调用 API 来切换 mod 状态
    setMods((prevMods) =>
      prevMods.map((mod) =>
        mod.id === modId ? { ...mod, isEnabled: !mod.isEnabled } : mod
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <button
          onClick={onBackToGames}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="w-4 h-4 mr-2"
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
        </button>
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
        <div className="text-center py-8">
          <p className="text-gray-600">Loading mods...</p>
        </div>
      )}

      {/* 错误状态 */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {/* Mod 列表 */}
      {!isLoading && !error && (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
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
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mod.isEnabled
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {mod.isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>Version: {mod.version}</p>
                        <p>Game: {mod.gameName}</p>
                        <p>Path: {mod.installPath}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* 启用/禁用切换 */}
                      <button
                        onClick={() => toggleModStatus(mod.id)}
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          mod.isEnabled
                            ? "text-red-700 bg-red-100 hover:bg-red-200 focus:ring-red-500"
                            : "text-green-700 bg-green-100 hover:bg-green-200 focus:ring-green-500"
                        }`}
                      >
                        {mod.isEnabled ? "Disable" : "Enable"}
                      </button>

                      {/* 删除按钮 */}
                      <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Remove
                      </button>
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
          <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <svg
              className="w-4 h-4 mr-2"
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
          </button>
        </div>
      )}
    </div>
  );
}

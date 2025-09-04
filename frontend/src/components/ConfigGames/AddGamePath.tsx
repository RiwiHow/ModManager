import { useState } from "react";

type GameData = {
  name: string;
  path: string;
};

interface AddGamePathProps {
  onGameAdded: () => Promise<void>;
}

export default function AddGamePath({ onGameAdded }: AddGamePathProps) {
  const [gameData, setGameData] = useState<GameData>({ name: "", path: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGameData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gameData.name.trim() || !gameData.path.trim()) {
      setMessage({ type: "error", text: "请填写游戏名称和路径" });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:8000/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      const newGame = await response.json();
      setMessage({
        type: "success",
        text: `游戏 "${newGame.name}" 添加成功！`,
      });
      setGameData({ name: "", path: "" });

      // 调用回调函数刷新游戏列表
      if (onGameAdded) {
        await onGameAdded();
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "添加游戏时发生错误",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-700 mb-4">Add a new Game</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Game Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={gameData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label
            htmlFor="path"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Game Path
          </label>
          <input
            type="text"
            id="path"
            name="path"
            value={gameData.path}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "添加中..." : "添加游戏"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md ${
            message.type === "success"
              ? "bg-green-50 border-l-4 border-green-500 text-green-700"
              : "bg-red-50 border-l-4 border-red-500 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

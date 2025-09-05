import { useState } from "react";
import type { Game } from "./ShowInstalledGames";

interface DeleteGameProps {
  game: Game;
  onGameDeleted: () => Promise<void>;
}

export default function DeleteGame({ game, onGameDeleted }: DeleteGameProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDeleteClick = () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/games/${game.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Error deleting game: ${response.statusText}`);
      }

      // 调用回调函数刷新游戏列表
      await onGameDeleted();
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete game:", error);
      alert("删除游戏失败，请重试");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  if (showConfirmation) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">确定删除吗？</span>
        <button
          onClick={handleConfirmDelete}
          disabled={isDeleting}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "删除中..." : "确定"}
        </button>
        <button
          onClick={handleCancelDelete}
          disabled={isDeleting}
          className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDeleteClick}
      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      title="删除游戏"
    >
      删除
    </button>
  );
}

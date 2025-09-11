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
        },
      );

      if (!response.ok) {
        throw new Error(`Error deleting game: ${response.statusText}`);
      }

      // Call callback to refresh game list
      await onGameDeleted();
      setShowConfirmation(false);
    } catch (error) {
      console.error("Failed to delete game:", error);
      alert("Failed to delete game, please try again");
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
        <span className="text-sm text-gray-600">
          Are you sure you want to delete?
        </span>
        <button
          onClick={handleConfirmDelete}
          disabled={isDeleting}
          className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700 "
        >
          {isDeleting ? "Deleting..." : "Yes"}
        </button>
        <button
          onClick={handleCancelDelete}
          disabled={isDeleting}
          className="rounded bg-gray-500 px-2 py-1 text-xs text-white"
        >
          No
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleDeleteClick}
      className="rounded-md bg-red-500 px-3 py-1 text-sm text-white transition-colors"
      title="Delete Game"
    >
      Delete
    </button>
  );
}

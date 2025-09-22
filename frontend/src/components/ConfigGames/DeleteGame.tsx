import { useState } from "react";
import type { Game } from "./ShowInstalledGames";
import Button from "../../ui/Button";

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
        `http://localhost:8000/api/games/${game.id}/delete`,
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
        <Button
          variant="delete-confirm"
          onClick={handleConfirmDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Yes"}
        </Button>
        <Button
          variant="delete-cancel"
          onClick={handleCancelDelete}
          disabled={isDeleting}
        >
          No
        </Button>
      </div>
    );
  }

  return (
    <Button variant="delete" onClick={handleDeleteClick} title="Delete Game">
      Delete
    </Button>
  );
}

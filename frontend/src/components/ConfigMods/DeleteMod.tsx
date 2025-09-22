import { useState } from "react";
import Button from "../../ui/Button";

interface DeleteModProps {
  game_id: number;
  mod_id: number;
  onModDeleted: () => Promise<void>;
}

export default function DeleteMod({
  game_id,
  mod_id,
  onModDeleted,
}: DeleteModProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDeleteMod() {
    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:8000/api/games/${game_id}/mods/${mod_id}/delete`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error(`Error deleting this mod: ${response.statusText}`);
      }

      await onModDeleted();
      setIsDeleting(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Button variant="remove" onClick={handleDeleteMod} disabled={isDeleting}>
      Remove
    </Button>
  );
}

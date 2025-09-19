import { useState } from "react";
import Button from "../../ui/Button";

interface DeleteModProps {
  mod_id: number;
  onModDeleted: () => Promise<void>;
}

export default function DeleteMod({ mod_id, onModDeleted }: DeleteModProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDeleteMod() {
    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:8000/api/mods/${mod_id}`, {
        method: "DELETE",
      });

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

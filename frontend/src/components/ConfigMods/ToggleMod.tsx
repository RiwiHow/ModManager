import { useState } from "react";
import Button from "../../ui/Button";

interface ToggleModProps {
  mod_id: number;
  enabled: boolean;
  onToggle: () => Promise<void>;
}

export default function ToggleMod({
  mod_id,
  enabled,
  onToggle,
}: ToggleModProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggle = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/mods/${mod_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enabled: enabled ? 0 : 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error toggling this mod: ${response.statusText}`);
      }

      await onToggle();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Error toggling mod:", errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        variant={enabled ? "disable" : "enable"}
        onClick={handleToggle}
        disabled={isLoading}
        title={error || undefined}
      >
        {isLoading ? "..." : enabled ? "Disable" : "Enable"}
      </Button>
      {error && (
        <span className="mt-1 text-xs text-red-600" title={error}>
          Error
        </span>
      )}
    </div>
  );
}

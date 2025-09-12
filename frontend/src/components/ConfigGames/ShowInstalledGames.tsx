import DeleteGame from "./DeleteGame";
import Button from "../../ui/Button";

export type Game = {
  id: number;
  name: string;
  path: string;
};

interface ShowInstalledGameProps {
  games: Game[];
  isLoading: boolean;
  error: string;
  onGameDeleted: () => Promise<void>;
  onManageMods: (game: Game) => void;
}

export default function ShowInstalledGame({
  games,
  isLoading,
  error,
  onGameDeleted,
  onManageMods,
}: ShowInstalledGameProps) {
  return (
    <div>
      <h3 className="header-2 mb-4">Configured Games</h3>
      {isLoading && <p className="normal-text">Loading...</p>}

      {error && (
        <div className="mb-4 rounded border-l-4 border-red-500 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {games.length === 0 && !isLoading && !error ? (
        <p className="normal-text">
          No games configured yet. Add your first game below.
        </p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {games.map((game) => (
            <li key={game.id} className="flex items-center py-2">
              <div className="flex-1">
                <span className="normal-text">{game.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="manage-mods"
                  onClick={() => onManageMods(game)}
                >
                  Manage Mods
                </Button>
                <DeleteGame game={game} onGameDeleted={onGameDeleted} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

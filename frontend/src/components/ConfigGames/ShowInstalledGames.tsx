import DeleteGame from "./DeleteGame";

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
      {isLoading && <p className="text-gray-600">Loading...</p>}

      {error && (
        <div className="mb-4 rounded border-l-4 border-red-500 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {games.length === 0 && !isLoading && !error ? (
        <p className="text-gray-600">
          No games configured yet. Add your first game below.
        </p>
      ) : (
        <ul>
          {games.map((game) => (
            <li
              key={game.id}
              className="flex items-center border-b border-gray-200 py-2 last:border-b-0"
            >
              <div className="flex-1">
                <span className="game-name">{game.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onManageMods(game)}
                  className="rounded-md bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                >
                  Manage Mods
                </button>
                <DeleteGame game={game} onGameDeleted={onGameDeleted} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

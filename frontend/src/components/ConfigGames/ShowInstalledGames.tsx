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
}

export default function ShowInstalledGame({
  games,
  isLoading,
  error,
  onGameDeleted,
}: ShowInstalledGameProps) {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        Configured Games
      </h3>
      {isLoading && <p className="text-gray-600">Loading...</p>}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {games.length === 0 && !isLoading ? (
        <p className="text-gray-600">
          No games configured yet. Add your first game below.
        </p>
      ) : (
        <ul className="space-y-0">
          {games.map((game) => (
            <li
              key={game.id}
              className="py-3 border-b border-gray-200 last:border-b-0 flex items-center justify-between"
            >
              <div className="flex-1">
                <strong className="text-gray-800">{game.name}</strong>
                <span className="text-gray-600">: {game.path}</span>
              </div>
              <div className="ml-4">
                <DeleteGame game={game} onGameDeleted={onGameDeleted} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

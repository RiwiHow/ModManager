import type { Mod } from "./ConfigMods";
import type { Game } from "../ConfigGames/ShowInstalledGames";
import DeleteMod from "./DeleteMod";
import ToggleMod from "./ToggleMod";

interface ShowInstalledModsProps {
  selectedGame: Game;
  mods: Mod[];
  onModDeleted: () => Promise<void>;
}

export function ShowInstalledMods({
  selectedGame,
  mods,
  onModDeleted,
}: ShowInstalledModsProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {mods.map((mod) => (
        <li key={mod.id} className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <div>
                <span className="normal-text align-middle">{mod.name}</span>
                <span
                  className={`mx-2.5 inline-block rounded-full px-2.5 py-0.5 align-middle text-xs font-medium ${
                    mod.enabled === 1
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {mod.enabled === 1 ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="sub-normal-text">
                <p>Version: {mod.version}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ToggleMod
                game_id={selectedGame.id}
                mod_id={mod.id}
                enabled={mod.enabled === 1}
                onToggle={onModDeleted}
              />

              <DeleteMod mod_id={mod.id} onModDeleted={onModDeleted} game_id={selectedGame.id}/>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

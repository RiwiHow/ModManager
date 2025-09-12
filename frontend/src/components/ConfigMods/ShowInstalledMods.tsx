import Button from "../../ui/Button";
import type { Mod } from "./ConfigMods";

interface ShowInstalledModsProps {
  mods: Mod[];
}

export function ShowInstalledMods({ mods }: ShowInstalledModsProps) {
  return (
    <ul className="divide-y divide-gray-200">
      {mods.map((mod) => (
        <li key={mod.id} className="p-6 hover:bg-gray-50">
          <div className="flex items-center">
            <div className="flex-1">
              <div>
                <span className="normal-text align-middle">{mod.name}</span>
                <span
                  className={`mx-2.5 inline-block rounded-full px-2.5 py-0.5 align-middle text-xs font-medium ${
                    mod.enabled
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {mod.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="sub-normal-text">
                <p>Version: {mod.version}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant={mod.enabled ? "disable" : "enable"}>
                {mod.enabled ? "Disable" : "Enable"}
              </Button>

              <Button variant="remove">Remove</Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

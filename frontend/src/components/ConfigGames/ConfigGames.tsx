import AddGamePath from "./AddGamePath";
import ShowInstalledGame from "./ShowInstalledGames";
import type { ShowInstalledGameRef } from "./ShowInstalledGames";
import { useRef } from "react";

export default function ConfigGames() {
  const showInstalledGameRef = useRef<ShowInstalledGameRef>(null);

  const handleGameAdded = () => {
    showInstalledGameRef.current?.refreshGames();
  };
  return (
    <main className="flex justify-center flex-col p-8 m-8">
      <ShowInstalledGame ref={showInstalledGameRef} />
      <AddGamePath onGameAdded={handleGameAdded} />
    </main>
  );
}

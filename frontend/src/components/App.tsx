import { useState } from "react";
import ConfigGames from "./ConfigGames/ConfigGames";
import Header from "./Header";
import ManageMods from "./ConfigMods/ManageMods";
import type { Game } from "./ConfigGames/ShowInstalledGames";

function App() {
  const [currentView, setCurrentView] = useState<"games" | "mods">("games");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleNavigateToMods = (game: Game) => {
    setSelectedGame(game);
    setCurrentView("mods");
  };

  const handleBackToGames = () => {
    setSelectedGame(null);
    setCurrentView("games");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {currentView === "games" ? (
        <ConfigGames onNavigateToMods={handleNavigateToMods} />
      ) : (
        <ManageMods
          onBackToGames={handleBackToGames}
          selectedGame={selectedGame}
        />
      )}
    </div>
  );
}

export default App;

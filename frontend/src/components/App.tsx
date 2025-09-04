import Header from "./Header";
import AddGamePath from "./edit-games/AddGamePath";
import ShowInstalledGame from "./edit-games/ShowInstalledGames";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="flex justify-center flex-col p-8 m-8">
        <ShowInstalledGame />
        <AddGamePath />
      </main>
    </div>
  );
}

export default App;

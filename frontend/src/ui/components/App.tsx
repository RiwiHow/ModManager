import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/test")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => setMessage(error));
  }, []);

  return (
    <div>
      <h1>Mod Manager MVP</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;

import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Board from "./pages/Board";

function App() {
  const { user } = useAuth();

  if (user) {
    return <Board />;
  }

  return <Login />;
}

export default App;

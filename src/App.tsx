import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import { CreateChat } from "./components/CreateChat";
import { Login } from "./components/Login";
import { Chat } from "./components/Chat";

export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
}

function App() {
  const [credentials, setCredentials] = useState<Credentials | null>(null);

  const handleLogin = (idInstance: string, apiTokenInstance: string) => {
    setCredentials({ idInstance, apiTokenInstance });
  };

  const isAuthenticated = () => credentials !== null;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/create-chat"
          element={
            isAuthenticated() ? (
              <CreateChat
                idInstance={credentials!.idInstance}
                apiTokenInstance={credentials!.apiTokenInstance}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/chat/:phoneNumber"
          element={
            isAuthenticated() ? (
              <Chat
                idInstance={credentials!.idInstance}
                apiTokenInstance={credentials!.apiTokenInstance}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

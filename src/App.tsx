import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useState } from "react";
import Chat from "./Chat";
import CreateChat from "./CreateChat";
import Login from "./Login";

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

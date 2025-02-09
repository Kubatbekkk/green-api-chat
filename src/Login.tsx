import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, TextField, Button, Box, Typography } from "@mui/material";

interface LoginProps {
  onLogin: (idInstance: string, apiTokenInstance: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (idInstance && apiTokenInstance) {
      onLogin(idInstance, apiTokenInstance);
      navigate("/create-chat");
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
        bgcolor: "white",
        borderRadius: 2,
        padding: 4,
        boxShadow: 3,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Вход
        </Typography>
        <TextField
          label="ID Instance"
          placeholder="Введите ID Instance"
          value={idInstance}
          onChange={(e) => setIdInstance(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <TextField
          label="API Token"
          placeholder="Введите API Token"
          value={apiTokenInstance}
          onChange={(e) => setApiTokenInstance(e.target.value)}
          fullWidth
          variant="outlined"
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          sx={{ mt: 2 }}
          fullWidth
        >
          Войти
        </Button>
      </Box>
    </Container>
  );
};

export default Login;

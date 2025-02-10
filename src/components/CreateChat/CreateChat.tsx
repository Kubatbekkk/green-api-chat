import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import { useChatStore } from "../../store";

export interface CreateChatProps {
  idInstance: string;
  apiTokenInstance: string;
}

export const CreateChat = ({
  idInstance,
  apiTokenInstance,
}: CreateChatProps) => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const loadChatHistory = useChatStore((state) => state.loadChatHistory);

  const isPhoneValid = (value: string) =>
    /^[0-9]*$/.test(value) && value.length <= 15;

  const handleCreateChat = async () => {
    if (isPhoneValid(phoneNumber)) {
      await loadChatHistory(phoneNumber, idInstance, apiTokenInstance);
      navigate(`/chat/${phoneNumber}`);
    } else {
      setError("Пожалуйста, введите номер телефона.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isPhoneValid(value)) {
      setPhoneNumber(value);
      setError("");
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
        backgroundColor: "#f4f6f8",
        borderRadius: 2,
        padding: 4,
        boxShadow: 1,
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Создать чат
        </Typography>
        <Typography variant="body1" component="p" gutterBottom>
          Введите номер телефона для создания нового чата. Номер должен
          содержать только цифры.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Введите номер телефона"
          placeholder="Введите номер телефона"
          value={phoneNumber}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          margin="normal"
          inputProps={{ maxLength: 15 }}
        />
        <Button
          variant="contained"
          color="success"
          onClick={handleCreateChat}
          sx={{ mt: 2 }}
          fullWidth
        >
          Создать чат
        </Button>
      </Box>
    </Container>
  );
};

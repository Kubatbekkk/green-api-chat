import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  IconButton,
  Button,
  List,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { MessageType, useChatStore } from "../../store";
import type { Credentials } from "../../App";
import Message from "./Message";

type ChatProps = Credentials;

export const Chat = ({ idInstance, apiTokenInstance }: ChatProps) => {
  const [message, setMessage] = useState<string>("");
  const chatHistory = useChatStore((state) => state.chatHistory);
  const sendMessageStore = useChatStore((state) => state.sendMessage);
  const getNotificationsStore = useChatStore((state) => state.getNotifications);
  const [messages, setMessages] = useState<MessageType[]>(chatHistory || []);
  const { phoneNumber } = useParams<{ phoneNumber: string }>();

  useEffect(() => {
    setMessages(chatHistory);

    const getNotifications = async () => {
      await getNotificationsStore(idInstance, apiTokenInstance);
      setMessages(useChatStore.getState().chatHistory);
    };

    const interval = setInterval(getNotifications, 10_000);

    return () => clearInterval(interval);
  }, [chatHistory, idInstance, apiTokenInstance, getNotificationsStore]);

  const sendMessage = async () => {
    if (!phoneNumber || !message) return;

    await sendMessageStore(phoneNumber, message, idInstance, apiTokenInstance);
    setMessages(useChatStore.getState().chatHistory);
    setMessage("");
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "white",
        p: 2,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <IconButton onClick={() => window.history.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" gutterBottom>
          Чат с {phoneNumber}
        </Typography>
      </Box>
      <Divider />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          my: 2,
          "&::-webkit-scrollbar": {
            width: "5px",
          },
          "&::-webkit-scrollbar-track": {
            background: "#f1f1f1",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#888",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <List>
          {messages.map((message, index) => (
            <Box
              key={`${message}${index}`}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems:
                  message.sender === "you" ? "flex-end" : "flex-start",
              }}
            >
              <Message text={message.text} sender={message.sender} />
            </Box>
          ))}
        </List>
      </Box>
      <Divider />
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Ваше сообщение"
          fullWidth
          variant="outlined"
        />
        <Button
          onClick={sendMessage}
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
        >
          Отправить
        </Button>
      </Box>
    </Container>
  );
};

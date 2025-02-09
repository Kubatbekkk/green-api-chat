import { Box, Typography } from "@mui/material";
import { styled } from "@mui/system";
import type { MessageType } from "./store";

type MessageProps = MessageType;

const MessageBubble = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isUserMessage",
})<{ isUserMessage: boolean }>(({ isUserMessage }) => ({
  textAlign: isUserMessage ? "right" : "left",
  margin: "5px",
  padding: "5px 5px 2px",
  backgroundColor: isUserMessage ? "#DCF8C6" : "#ECECEC",
  borderRadius: "10px",
  border: "1px solid #D4D5D6",
  maxWidth: "70%",
  color: isUserMessage ? "#000000" : "#000000",
  alignSelf: isUserMessage ? "flex-end" : "flex-start",
}));

const Message = ({ text, sender }: MessageProps) => {
  const isUserMessage = sender === "you";

  return (
    <MessageBubble isUserMessage={isUserMessage}>
      <Typography variant="body2">{text}</Typography>
      <Typography sx={{ fontSize: 8 }}>
        {isUserMessage ? "Вы" : sender.split("@")[0]}
      </Typography>
    </MessageBubble>
  );
};

export default Message;

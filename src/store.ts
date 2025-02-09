import { create } from "zustand";
import axios from "axios";

export interface MessageType {
  text: string;
  sender: string;
}

interface ChatStore {
  chatHistory: MessageType[];
  setChatHistory: (history: MessageType[]) => void;
  loadChatHistory: (
    phoneNumber: string,
    idInstance: string,
    apiTokenInstance: string,
  ) => Promise<void>;
  sendMessage: (
    phoneNumber: string,
    message: string,
    idInstance: string,
    apiTokenInstance: string,
  ) => Promise<void>;
  getNotifications: (
    idInstance: string,
    apiTokenInstance: string,
  ) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatHistory: [],
  setChatHistory: (history) => set({ chatHistory: history }),
  loadChatHistory: async (phoneNumber, idInstance, apiTokenInstance) => {
    try {
      const response = await axios.post(
        `https://api.green-api.com/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
        { chatId: `${phoneNumber}@c.us`, count: 10 },
      );

      const chatHistory = response.data.reverse();

      const formattedMessages = chatHistory.map((msg: any) => ({
        text:
          msg.typeMessage === "textMessage"
            ? msg.textMessage
            : msg.extendedTextMessage?.text,
        sender: msg.type === "incoming" ? msg.senderId : "you",
      }));

      set({ chatHistory: formattedMessages });
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  },
  sendMessage: async (phoneNumber, message, idInstance, apiTokenInstance) => {
    try {
      await axios.post(
        `https://api.green-api.com/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
          chatId: `${phoneNumber}@c.us`,
          message,
        },
      );

      const newMessage = { text: message, sender: "you" };
      set((state) => ({ chatHistory: [...state.chatHistory, newMessage] }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },
  getNotifications: async (idInstance, apiTokenInstance) => {
    try {
      const response = await axios.get(
        `https://api.green-api.com/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
      );

      if (response.data) {
        const {
          body: { typeWebhook, messageData, senderData },
          receiptId,
        } = response.data;

        if (typeWebhook !== "incomingMessageReceived") return;

        if (
          typeWebhook === "incomingMessageReceived" &&
          messageData.typeMessage === "textMessage"
        ) {
          const newMessage = {
            text: messageData.textMessageData.textMessage,
            sender: senderData.chatId,
          };

          set((state) => ({
            chatHistory: [...state.chatHistory, newMessage],
          }));

          await axios.delete(
            `https://api.green-api.com/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
          );
        }
      }
    } catch (error) {
      console.error("Error receiving message:", error);
    }
  },
}));

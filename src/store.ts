import { create } from "zustand";
import { apiPost, apiGet, apiDelete } from "./utils";

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
      const response = await apiPost(
        `/waInstance${idInstance}/getChatHistory/${apiTokenInstance}`,
        { chatId: `${phoneNumber}@c.us`, count: 10 },
      );

      const chatHistory = response.data.reverse().map((msg: any) => ({
        text:
          msg.typeMessage === "textMessage"
            ? msg.textMessage
            : msg.extendedTextMessage?.text,
        sender: msg.type === "incoming" ? msg.senderId : "you",
      }));

      set({ chatHistory });
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  },

  sendMessage: async (phoneNumber, message, idInstance, apiTokenInstance) => {
    try {
      await apiPost(
        `/waInstance${idInstance}/sendMessage/${apiTokenInstance}`,
        {
          chatId: `${phoneNumber}@c.us`,
          message,
        },
      );

      set((state) => ({
        chatHistory: [...state.chatHistory, { text: message, sender: "you" }],
      }));
    } catch (error) {
      console.error("Error sending message:", error);
    }
  },

  getNotifications: async (idInstance, apiTokenInstance) => {
    try {
      const response = await apiGet(
        `/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`,
      );

      if (response.data) {
        const {
          body: { typeWebhook, messageData, senderData },
          receiptId,
        } = response.data;

        if (
          typeWebhook === "incomingMessageReceived" &&
          messageData.typeMessage === "textMessage"
        ) {
          const newMessage = {
            text: messageData.textMessageData.textMessage,
            sender: senderData.chatId,
          };

          set((state) => ({ chatHistory: [...state.chatHistory, newMessage] }));
          await apiDelete(
            `/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`,
          );
        }
      }
    } catch (error) {
      console.error("Error receiving message:", error);
    }
  },
}));

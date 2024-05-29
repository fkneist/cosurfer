import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import { sendMessageToLLM } from "../services/ChatService";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const handleClick = async () => {
  try {
    const tabs = await new Promise<chrome.tabs.Tab[]>((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].id) {
          resolve(tabs);
        } else {
          reject(new Error("No active tab found"));
        }
      });
    });

    const result = await new Promise<string | null>((resolve, reject) => {
      if (tabs[0].id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: printBodyText,
          },
          (results) => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError);
            } else if (results && results[0]) {
              resolve(results[0].result as string);
            } else {
              resolve(null);
            }
          }
        );
      } else {
        reject();
      }
    });

    return result;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const printBodyText = () => {
  return document.body.innerText;
};

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Load messages from local storage on component mount
  useEffect(() => {
    const storedMessages = localStorage.getItem("chatMessages");
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  // Update local storage whenever messages state changes
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleDeleteMessage = (id: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    const text1 = await handleClick();

    const message = ` In the following you'll get the content of a website and a question about it. Please answer the question with the information from the website.

    === WEBSITE CONTENT ===
    ${text1}

    === QUESTION ===
    ${text}

    === END ===
    `;

    const botResponse = await sendMessageToLLM(message);

    const data = {
      reply: botResponse,
    };

    const botMessage: ChatMessage = {
      id: uuidv4(),
      text: data.reply,
      sender: "bot",
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, botMessage]);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatWindow messages={messages} onDelete={handleDeleteMessage} />
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatApp;

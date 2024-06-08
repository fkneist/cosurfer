import React from "react";
import { TrashSolidIcon } from "./Icons";

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatMessageProps {
  message: ChatMessage;
  onDelete: (id: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onDelete }) => {
  return (
    <div className="flex flex-col mx-4 mb-4">
      {message.sender === "bot" && (
        <div className="chat chat-start">
          <div className="chat-bubble">
            <div className="flex flex-row">
              <div>{message.text}</div>
              <button
                className="absolute top-0 right-0 m-1 text-xs text-grey-200 hover:text-red-700"
                onClick={() => onDelete(message.id)}
              >
                <TrashSolidIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {message.sender === "user" && (
        <div className="chat chat-end">
          <div className="chat-bubble">
            <div className="flex flex-row">
              <div>{message.text}</div>
              <button
                className="top-0 right-0 m-1 text-xs text-grey-200 hover:text-red-700"
                onClick={() => onDelete(message.id)}
              >
                <TrashSolidIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

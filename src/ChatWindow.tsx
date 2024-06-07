import React, { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

interface ChatWindowProps {
  messages: ChatMessage[];
  onDelete: (id: string) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onDelete }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const [prevMessageCount, setPrevMessageCount] = useState(messages.length);

  useEffect(() => {
    if (messages.length > prevMessageCount) {
      // Only scroll to the bottom if a new message is added
      if (endOfMessagesRef.current) {
        endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    setPrevMessageCount(messages.length);
  }, [messages, prevMessageCount]);

  // const [isValid, setIsValid] = useState(null);

  // useEffect(() => {
  //   chrome.storage.sync.get("isValid", (result) => {
  //     setIsValid(result.isValid);
  //   });
  // }, []);

  return (
    <div className="flex-grow overflow-y-auto p-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} onDelete={onDelete} />
      ))}
      <div ref={endOfMessagesRef} />

      {/* ALERTS */}
      {/* TODO: re-enable for groq */}
      {/* {!isValid && (
        <div role="alert" className="alert alert-error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>No valid API token provided. Go to settings.</span>
        </div>
      )} */}
    </div>
  );
};

export default ChatWindow;

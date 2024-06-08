import React, { useState, useEffect } from "react";
import { PaperAirplaneIcon } from "./Icons";

interface ChatInputProps {
  onSendMessage: (text: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get("isValid", (result) => {
      setIsValid(result.isValid);
    });
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex p-4 border-t border-gray-200">
      <input
        type="text"
        className="input input-bordered flex-grow mr-2"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        // disabled={!isValid}
      />
      <button
        type="submit"
        className="btn btn-primary"
        // disabled={!isValid}
      >
        <PaperAirplaneIcon className="w-6 h-6" />
      </button>
    </form>
  );
};

export default ChatInput;

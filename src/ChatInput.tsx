import React, { useState, useEffect } from "react";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
          />
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;

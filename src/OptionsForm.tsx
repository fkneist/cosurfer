import React, { useState, useEffect } from "react";
import { sendMessageToLLM } from "../services/ChatService";

const OptionsForm = () => {
  const [groqApiKey, setGroqApiKey] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    // Load the saved API key and its validity state when the options page is opened
    chrome.storage.sync.get(["groqApiKey", "isValid"], (result) => {
      if (result.groqApiKey) {
        setGroqApiKey(result.groqApiKey);
      }
      if (result.isValid !== undefined) {
        setIsValid(result.isValid);
      }
    });
  }, []);

  const handleChange = (event: any) => {
    setGroqApiKey(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    chrome.storage.sync.set({ groqApiKey, isValid: false });

    const isValidKey = await validateApiKey(groqApiKey);

    if (isValidKey) {
      chrome.storage.sync.set({ groqApiKey, isValid: true }, () => {
        setStatusMessage("Groq API key saved successfully!");
        setIsValid(true);
      });
    } else {
      setStatusMessage("Invalid API key. Please try again.");
      setIsValid(false);
      chrome.storage.sync.set({ isValid: false });
    }
  };

  const validateApiKey = async (key: any) => {
    try {
      await sendMessageToLLM("hi", 1);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div>
      <h1>Options</h1>
      <form id="options-form" onSubmit={handleSubmit}>
        <label>
          Groq API Key:
          <input
            type="text"
            id="groq-api-key"
            value={groqApiKey}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
      </form>
      {statusMessage && (
        <div style={{ color: isValid ? "green" : "red", marginTop: "10px" }}>
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default OptionsForm;

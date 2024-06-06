import "./index.css";
import { useState, useEffect } from "react";
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
    <div className="prose m-4">
      <div className="flex flex-row justify-center">
        <h1>Options</h1>
      </div>
      <form
        id="options-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* OPENAI */}
        <div>
          <div className="label">
            <span className="label-text">API key OpenAI:</span>
          </div>
          <label>
            <input
              type="text"
              id="openai-api-key"
              value="coming soon ..."
              className="input input-bordered w-full"
              disabled
            />
          </label>
        </div>

        {/* GROQ */}
        <div>
          <div className="label">
            <span className="label-text">API key groq:</span>
          </div>
          <label>
            <input
              type="text"
              id="groq-api-key"
              value={groqApiKey}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
        </div>

        <div>
          <a href="https://console.groq.com/keys" target="_blank">
            Get your groq API key
          </a>
        </div>

        <button className="btn btn-primary" type="submit">
          Save
        </button>
      </form>
      <div style={{ color: isValid ? "green" : "red" }} className="h-4">
        {statusMessage ? statusMessage : " "}
      </div>
    </div>
  );
};

export default OptionsForm;

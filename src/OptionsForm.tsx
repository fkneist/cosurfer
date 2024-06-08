import "./index.css";
import { useState, useEffect } from "react";
import { sendMessageToLLM } from "../services/ChatService";
import ProviderSelector from "./ProviderSelector";
import OnlineModelProviderSettings from "./OnlineModelProviderSettings";
import LocalModelProviderSettings from "./LocalModelProviderSettings";

const PROVIDERS = {
  OPENAI: "openai",
  GROQ: "groq",
  OLLAMA: "ollama",
};

const OptionsForm = () => {
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState({ openai: "", groq: "", ollama: "" });
  const [modelsAvailable, setModelsAvailable] = useState({
    openai: [],
    groq: [],
    ollama: [],
  });
  const [apiKeys, setApiKeys] = useState({ openai: "", groq: "" });
  const [address, setAddress] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(["isValid"], (result) => {
      if (result.isValid !== undefined) {
        setIsValid(result.isValid);
      }
    });
  }, []);

  useEffect(() => {
    chrome.storage.sync.get(
      ["provider", "model", "apiKeys", "address"],
      (result) => {
        setProvider(result.provider || "");
        setModel(result.model || { openai: "", groq: "", ollama: "" });
        setApiKeys(result.apiKeys || { openai: "", groq: "" });
        setAddress(result.address || "");
      }
    );
  }, []);

  useEffect(() => {
    fetchModels();
  }, [provider]);

  const saveSettings = async () => {
    await chrome.storage.sync.set({ isValid: false, apiKeys });

    if (provider === PROVIDERS.GROQ) {
      const isValidKey = await validateApiKey();

      if (isValidKey) {
        await chrome.storage.sync.set({ isValid: true });
        setStatusMessage("Groq API key saved successfully!");
        setIsValid(true);
      } else {
        setStatusMessage("Invalid API key. Please try again.");
        setIsValid(false);
        await chrome.storage.sync.set({ isValid: false });
      }
    }

    await chrome.storage.sync.set({ provider, model, apiKeys, address });
  };

  const validateApiKey = async () => {
    try {
      await sendMessageToLLM("hi", 1);
      return true;
    } catch {
      return false;
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch(`${address}/api/tags`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const tags = data.models.map((tag: any) => tag.name);
      return tags;
    } catch (error) {
      console.error("Fetch operation error:", error);
      return [];
    }
  };

  const fetchModels = async () => {
    let fetchedModels = [];
    if (provider === PROVIDERS.GROQ) {
      fetchedModels = ["llama3:8b"];
    } else if (provider === PROVIDERS.OLLAMA) {
      fetchedModels = await fetchTags();
    }

    setModelsAvailable((prevModels) => ({
      ...prevModels,
      [provider]: fetchedModels,
    }));

    await chrome.storage.sync.set({
      models: { ...modelsAvailable, [provider]: fetchedModels },
    });
  };

  return (
    <div className="prose m-4 flex flex-col">
      <div className="flex flex-row justify-center">
        <h1>Options</h1>
      </div>

      <ProviderSelector provider={provider} setProvider={setProvider} />

      {provider &&
        (provider === PROVIDERS.OPENAI || provider === PROVIDERS.GROQ) && (
          <OnlineModelProviderSettings
            provider={provider}
            model={model[provider as keyof typeof model]}
            setModel={(m) => setModel({ ...model, [provider]: m })}
            apiKey={apiKeys[provider as keyof typeof apiKeys]}
            setApiKey={(key) => setApiKeys({ ...apiKeys, [provider]: key })}
          />
        )}

      {provider && provider === PROVIDERS.OLLAMA && (
        <LocalModelProviderSettings
          modelSelected={model[PROVIDERS.OLLAMA as keyof typeof model]}
          setModel={(m) => setModel({ ...model, [provider]: m })}
          address={address}
          setAddress={setAddress}
          modelsAvailable={
            modelsAvailable[PROVIDERS.OLLAMA as keyof typeof model]
          }
          refreshModels={fetchModels}
        />
      )}

      <button
        onClick={saveSettings}
        className="btn btn-primary mt-4 w-full"
        type="submit"
      >
        Save
      </button>

      <div style={{ color: isValid ? "green" : "red" }} className="h-4">
        {statusMessage ? statusMessage : " "}
      </div>
    </div>
  );
};

export default OptionsForm;

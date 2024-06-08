import "./index.css";
import { useState, useEffect } from "react";
import { sendMessageToLLM } from "../services/ChatService";

const PROVIDERS = {
  OPENAI: "openai",
  GROQ: "groq",
  OLLAMA: "ollama",
};

const OptionsForm = () => {
  const [provider, setProvider] = useState("");
  const [model, setModel] = useState({ openai: "", groq: "", ollama: "" });
  const [modelsAvailable, setModelsAvailable] = useState<{
    [key: string]: string[];
  }>({
    openai: [],
    groq: [],
    ollama: [],
  });
  const [apiKeys, setApiKeys] = useState({ openai: "", groq: "" });
  const [address, setAddress] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    chrome.storage.sync.get(["isValid"], (result) => {
      if (result.isValid !== undefined) {
        setIsValid(result.isValid);
      }
    });
  }, []);

  useEffect(() => {
    // Load settings from Chrome Storage
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

  const saveSettings = async () => {
    chrome.storage.sync.set({ isValid: false, apiKeys });

    // check if provider is groq
    if (provider === PROVIDERS.GROQ) {
      // validate the groq API key
      const isValidKey = await validateApiKey();

      if (isValidKey) {
        chrome.storage.sync.set({ isValid: true }, () => {
          setStatusMessage("Groq API key saved successfully!");
          setIsValid(true);
        });
      } else {
        setStatusMessage("Invalid API key. Please try again.");
        setIsValid(false);
        chrome.storage.sync.set({ isValid: false });
      }
    }

    // Save settings to Chrome Storage
    chrome.storage.sync.set({
      provider,
      model,
      apiKeys,
      address,
    });
  };

  const validateApiKey = async () => {
    try {
      await sendMessageToLLM("hi", 1);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    fetchModels();
  }, [provider]);

  const fetchTags = async () => {
    try {
      const response = await fetch(`${address}/api/tags`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);

      const tags = data.models.map((tag: any) => tag.name);

      return tags;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
      return [];
    }
  };

  const fetchModels = async () => {
    console.log("Fetching models...");
    let fetchedModels: string[] = [];
    if (provider === PROVIDERS.GROQ) {
      fetchedModels = ["llama3:8b"];
    } else if (provider === PROVIDERS.OLLAMA) {
      fetchedModels = await fetchTags();
    }

    setModelsAvailable((prevModels) => ({
      ...prevModels,
      [provider]: fetchedModels,
    }));

    chrome.storage.sync.set({
      models: {
        ...modelsAvailable,
        [provider]: fetchedModels,
      },
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
            apiKey={apiKeys[provider as keyof typeof apiKeys]} // Add index signature to apiKeys object type
            setApiKey={(key) => setApiKeys({ ...apiKeys, [provider]: key })}
          />
        )}
      {provider && provider === PROVIDERS.OLLAMA && (
        <LocalModelProviderSettings
          modelSelected={model[PROVIDERS.OLLAMA as keyof typeof model]}
          setModel={(m) => setModel({ ...model, [provider]: m })}
          address={address}
          setAddress={(address) => setAddress(address)}
          modelsAvailable={modelsAvailable[PROVIDERS.OLLAMA]}
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

const ProviderSelector = ({
  provider,
  setProvider,
}: {
  provider: string;
  setProvider: (value: string) => void;
}) => (
  <div>
    <label>Select LLM Provider:</label>
    <select
      value={provider}
      onChange={(e) => setProvider(e.target.value)}
      className="select select-bordered w-full"
    >
      <option disabled selected>
        Select...
      </option>
      <option value={PROVIDERS.OPENAI}>OpenAI</option>
      <option value={PROVIDERS.GROQ}>Groq</option>
      <option value={PROVIDERS.OLLAMA}>Ollama (local)</option>
    </select>
  </div>
);

const OnlineModelProviderSettings = ({
  provider,
  model,
  setModel,
  apiKey,
  setApiKey,
}: {
  provider: string;
  model: string;
  setModel: (value: string) => void;
  apiKey: string;
  setApiKey: (value: string) => void;
}) => (
  <div className="flex flex-col gap-4">
    <div>
      <div className="label">
        <span className="label-text">API key:</span>
      </div>
      <input
        className="input input-bordered w-full"
        type="text"
        value={provider === PROVIDERS.GROQ ? apiKey : "Coming soon..."}
        onChange={(e) => setApiKey(e.target.value)}
        disabled={provider === PROVIDERS.OPENAI}
      />
    </div>

    {provider === PROVIDERS.GROQ && (
      <div>
        <a href="https://console.groq.com/keys" target="_blank">
          Get your groq API key
        </a>
      </div>
    )}

    <div>
      <div className="label">
        <span className="label-text">Model:</span>
      </div>
      <input
        className="input input-bordered w-full"
        type="text"
        // value={model}
        value={"Coming soon..."}
        onChange={(e) => setModel(e.target.value)}
        disabled
      />
    </div>
  </div>
);

const LocalModelProviderSettings = ({
  modelSelected,
  setModel,
  address,
  setAddress,
  modelsAvailable,
  refreshModels,
}: {
  modelSelected: string;
  setModel: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  modelsAvailable: string[];
  refreshModels: () => void;
}) => (
  <div>
    <div className="label">
      <span className="label-text">Address with Port:</span>
    </div>
    <input
      className="input input-bordered w-full"
      type="text"
      value={address}
      onChange={(e) => setAddress(e.target.value)}
    />

    {/* MODEL TAGS DROPDOWN */}
    <div className="flex flex-row gap-2 w-full">
      <div className="w-full">
        <div className="label">
          <span className="label-text">Model:</span>
        </div>
        <select
          className="select select-bordered w-full"
          value={modelSelected}
          onChange={(e) => setModel(e.target.value)}
        >
          <option disabled selected>
            Select...
          </option>
          {modelsAvailable.map((model: string) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <div
        className="tooltip tooltip-left self-end"
        data-tip="Refresh model list"
      >
        <button onClick={refreshModels} className="btn btn-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export default OptionsForm;

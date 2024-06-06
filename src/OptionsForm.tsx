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
  const [model, setModel] = useState({ openai: "", groq: "" });
  const [apiKeys, setApiKeys] = useState({ openai: "", groq: "" });
  const [localSettings, setLocalSettings] = useState({
    address: "",
    model: "",
  });
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
      ["provider", "model", "apiKeys", "localSettings"],
      (result) => {
        setProvider(result.provider || "");
        setModel(result.model || { openai: "", groq: "" });
        setApiKeys(result.apiKeys || { openai: "", groq: "" });
        setLocalSettings(result.localSettings || { address: "", model: "" });
      }
    );
  }, []);

  const saveSettings = async () => {
    chrome.storage.sync.set({ isValid: false, apiKeys });

    // check if provider is groq
    if (provider === PROVIDERS.GROQ) {
      // validate the groq API key
      const isValidKey = await validateApiKey(
        apiKeys[provider as keyof typeof apiKeys]
      );

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
      localSettings,
    });
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
          model={localSettings.model}
          setModel={(model) => setLocalSettings({ ...localSettings, model })}
          address={localSettings.address}
          setAddress={(address) =>
            setLocalSettings({ ...localSettings, address })
          }
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
  model,
  setModel,
  address,
  setAddress,
}: {
  model: string;
  setModel: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
}) => (
  <div>
    <div className="label">
      <span className="label-text">Address with Port:</span>
    </div>
    <input
      className="input input-bordered w-full"
      type="text"
      // value={address}
      value={"Coming soon..."}
      onChange={(e) => setAddress(e.target.value)}
      disabled
    />
    <div className="label">
      <span className="label-text">Model</span>
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
);

export default OptionsForm;

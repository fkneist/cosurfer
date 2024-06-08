const PROVIDERS = {
  OPENAI: "openai",
  GROQ: "groq",
};

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
        value={"Coming soon..."}
        onChange={(e) => setModel(e.target.value)}
        disabled
      />
    </div>
  </div>
);

export default OnlineModelProviderSettings;

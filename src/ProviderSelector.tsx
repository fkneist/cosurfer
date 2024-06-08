const PROVIDERS = {
  OPENAI: "openai",
  GROQ: "groq",
  OLLAMA: "ollama",
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
      onChange={(e: any) => setProvider(e.target.value)}
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

export default ProviderSelector;

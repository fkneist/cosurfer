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
          {modelsAvailable.map((model) => (
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

export default LocalModelProviderSettings;

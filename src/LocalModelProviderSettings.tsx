import { ArrowPathIcon } from "./Icons";

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
          <ArrowPathIcon className="size-6" />
        </button>
      </div>
    </div>
  </div>
);

export default LocalModelProviderSettings;

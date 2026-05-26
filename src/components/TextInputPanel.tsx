interface TextInputPanelProps {
  label: string;
  helper: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  minRows?: number;
}

export function TextInputPanel({
  label,
  helper,
  value,
  placeholder,
  onChange,
  minRows = 5,
}: TextInputPanelProps) {
  return (
    <label className="text-panel">
      <span className="text-panel-label">{label}</span>
      <span className="text-panel-helper">{helper}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={minRows}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

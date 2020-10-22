import * as React from "react";

type RadioProps<Value> = React.PropsWithChildren<{
  name: string;
  value?: Value;
  onChange?: (value: Value) => void;
  options?: Record<string, Value>;
}>;

export function Radio<Value extends string>({
  name,
  value,
  onChange,
  options,
}: RadioProps<Value>) {
  if (!options || typeof options !== "object" || !Object.keys(options).length)
    return <></>;
  return (
    <>
      {Object.entries(options).map(([label, option], i) => (
        <label key={i}>
          <input
            type="radio"
            name={name}
            value={option || ""}
            checked={value === option}
            onChange={React.useCallback(() => onChange?.(option), [
              onChange,
              option,
            ])}
          />
          <span>{label}</span>
        </label>
      ))}
    </>
  );
}

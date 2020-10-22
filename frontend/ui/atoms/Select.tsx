import * as React from "react";

type SelectProps<Value> = React.PropsWithChildren<{
  name: string;
  value?: Value;
  onChange?: (value: Value) => void;
  options?: Record<string, Value>;
}>;

export function Select<Value extends string>({
  name,
  value,
  onChange,
  options,
}: SelectProps<Value>) {
  if (!options || typeof options !== "object" || !Object.keys(options).length)
    return <></>;
  return (
    <select
      name={name}
      value={value || ""}
      onChange={(e) => onChange?.(getValue(e))}
    >
      {Object.entries(options).map(([key, value]) => (
        <option key={key} value={value}>
          {key}
        </option>
      ))}
    </select>
  );
}

function getValue<T>(e: React.ChangeEvent<HTMLSelectElement>): T {
  const isValue = (x: unknown): x is T => typeof x === "string";
  if (isValue(e.currentTarget.value)) return e.currentTarget.value;
  throw Error();
}

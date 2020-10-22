import * as React from "react";

type CheckboxProps<Value> = React.PropsWithChildren<{
  name: string;
  value?: Value;
  onChange?: (value: Value | undefined) => void;
  checked?: boolean;
}>;

export function Checkbox<Value extends string>({
  name,
  value,
  onChange,
  checked,
}: CheckboxProps<Value>) {
  return (
    <input
      type="checkbox"
      name={name}
      value={value || ""}
      onChange={(e) => onChange?.(getValue(e))}
      checked={checked}
    />
  );
}

function getValue<T>(e: React.ChangeEvent<HTMLInputElement>): T | undefined {
  if (!e.currentTarget.checked) return undefined;
  const isValue = (x: unknown): x is T => typeof x === "string";
  if (isValue(e.currentTarget.value)) return e.currentTarget.value;
  throw Error();
}

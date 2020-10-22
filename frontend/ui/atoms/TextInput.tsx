import * as React from "react";

type TextInputProps<Value> = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> &
  React.PropsWithChildren<{
    type?: "text" | "password";
    name: string;
    value?: Value;
    onChange?: (value: Value | undefined) => void;
  }>;

export function TextInput<Value extends string>({
  type = "text",
  name,
  value,
  onChange,
}: TextInputProps<Value>) {
  return (
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={(e) => onChange?.(getValue(e))}
    />
  );
}

function getValue<T>(e: React.ChangeEvent<HTMLInputElement>): T | undefined {
  const isValue = (x: unknown): x is T => typeof x === "string";
  if (isValue(e.currentTarget.value)) return e.currentTarget.value;
  throw Error();
}

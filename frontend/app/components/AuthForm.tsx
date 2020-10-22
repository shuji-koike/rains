import * as React from "react";
import { TextInput } from "../../ui/atoms/TextInput";

export interface Auth {
  user?: string;
  pass?: string;
}

export const AuthForm: React.FC<{
  state: Auth;
  onChange?: (state: Partial<Auth>) => void;
}> = React.memo(({ state: { user, pass }, onChange }) => {
  return (
    <fieldset>
      <legend>ログイン</legend>
      <fieldset>
        <TextInput
          name="user"
          value={user}
          autoComplete="username"
          onChange={(value) => onChange?.({ user: value })}
        />
        <TextInput
          type="password"
          name="pass"
          autoComplete="current-password"
          value={pass}
          onChange={(value) => onChange?.({ pass: value })}
        />
      </fieldset>
    </fieldset>
  );
});

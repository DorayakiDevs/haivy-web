import { useEffect, useState } from "react";

type Validator = (cur: string) => string;

export function useValidatableState(initialValue = "", validator?: Validator) {
  const state = useState(initialValue);
  const [error, setError] = useState("");
  const [value, setValue] = state;

  useEffect(() => {
    setError("");
  }, [value]);

  /**
   * Validate current state
   * @param __validator Override validator
   * @returns
   */
  function validate(__validator?: Validator) {
    const vad = __validator || validator;
    if (!vad) return "";

    const err = vad(value);
    setError(err);

    return !err;
  }

  return { state, current: value, setValue, error, validate };
}

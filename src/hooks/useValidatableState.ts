import { useEffect, useState } from "react";

type Validator = (cur: string) => string | undefined;

export function useValidatableState(
  initialValue = "",
  ...validators: Validator[]
) {
  const state = useState(initialValue);
  const [errors, setErrors] = useState<string[]>([]);
  const [value, setValue] = state;

  useEffect(() => {
    setErrors([]);
  }, [value]);

  /**
   * Validate current state
   * @param __validator Override validator
   * @returns
   */
  function validate(...__validators: Validator[]) {
    const vads = [...__validators, ...validators];

    const newErrors = [];

    for (const validator of vads) {
      const error = validator(state[0]);
      if (error?.length) newErrors.push(error);
    }

    setErrors(newErrors);

    return newErrors.length === 0;
  }

  return {
    state,
    current: value,
    setValue,
    errors,
    validate,
    error: errors[0] || "",
  };
}

import { useEffect, useRef, useState } from "react";

export type Validators = (cur: string) => string | undefined;

export default function useValidatableState(
  initialValue = "",
  ...validators: Validators[]
) {
  const initRef = useRef(initialValue);

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
  function validate(...__validators: Validators[]) {
    const vads = [...__validators, ...validators];

    const newErrors = [];

    for (const validator of vads) {
      const error = validator(state[0]);
      if (error?.length) newErrors.push(error);
    }

    setErrors(newErrors);

    return newErrors.length === 0;
  }

  function hasChanged() {
    return value !== initRef.current;
  }

  function setValueInit(value: string) {
    setValue(value);
    initRef.current = value;
  }

  function reset() {
    setValue(initRef.current);
  }

  return {
    state,
    current: value,
    errors,
    validate,
    hasChanged,
    reset,
    setValue,
    setValueInit,
    error: errors[0] || "",
  };
}

import { useCallback, useState } from "react";

export default function useSelectedIndexes(initialIndexes: number[] = []) {
  const [selectedIndexes, setSelectedIndexes] =
    useState<number[]>(initialIndexes);

  const add = useCallback((index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev : [...prev, index]
    );
  }, []);

  const remove = useCallback((index: number) => {
    setSelectedIndexes((prev) => prev.filter((i) => i !== index));
  }, []);

  const set = useCallback((i: number) => {
    setSelectedIndexes([i]);
  }, []);

  const isActive = useCallback(
    (index: number): boolean => {
      return selectedIndexes.includes(index);
    },
    [selectedIndexes]
  );

  const selectRange = useCallback((a: number, b: number) => {
    if (a === b) return;

    const [start, end] = a < b ? [a, b] : [b, a];
    const range = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    setSelectedIndexes((prev) => {
      const uniqueSet = new Set(prev);
      range.forEach((i) => uniqueSet.add(i));
      return Array.from(uniqueSet);
    });
  }, []);

  const toggle = useCallback((index: number) => {
    setSelectedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  }, []);

  const clear = useCallback(() => {
    setSelectedIndexes([]);
  }, []);

  const value = {
    list: selectedIndexes,
    add,
    set,
    remove,
    isActive,
    toggle,
    clear,
    selectRange,
  };

  return value;
}

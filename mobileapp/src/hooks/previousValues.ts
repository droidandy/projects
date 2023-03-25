import { useEffect, useRef } from 'react';

/**
 * Запоминает предыдущее переданное значение.
 * @param {*} value - значение, которое нужно запомнить.
 * @returns {*} - предыдущее значение.
 */
export const usePreviousValues = <T>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
};

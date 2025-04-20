import { useEffect, useState } from "react";

export function useLocalStorage<T>(key: string, intialValue: T) {
  const [storeValue, setStoreValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : intialValue;
    } catch (error) {
      console.error(error);
      return intialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storeValue));
    } catch (error) {
      console.error(error);
    }
  }, [key, storeValue]);

  return [storeValue, setStoreValue] as const;
}

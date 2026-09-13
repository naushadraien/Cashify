import { useRef } from "react";
import { TextInput } from "react-native";

export function useInputFocus(fieldCount: number) {
  const inputRefs = useRef<(TextInput | null)[]>(Array(fieldCount).fill(null));

  const setRef = (index: number) => (ref: TextInput | null) => {
    inputRefs.current[index] = ref;
  };

  const focusNext = (currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < inputRefs.current.length) {
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const focusPrevious = (currentIndex: number) => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      inputRefs.current[prevIndex]?.focus();
    }
  };

  const focusIndex = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const blurAll = () => {
    inputRefs.current.forEach((ref) => ref?.blur());
  };

  return {
    setRef,
    focusNext,
    focusPrevious,
    focusIndex,
    blurAll,
  };
}

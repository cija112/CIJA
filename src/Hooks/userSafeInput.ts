import { useState } from "react";

export function useSafeInput(initialValue = "", maxLength = 40) {
  const [value, setValue] = useState(initialValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = e.target.value;

    // Limite fisico de caracteres
    if (text.length > maxLength) return;

    // Bloqueia spam de letras repetidas ex: "aaaa"
    const regexSpam = /([a-zA-ZÀ-ÿ])\1{3,}/;
    if (regexSpam.test(text)) return;

    setValue(text);
  };

  return { value, onChange, setValue };
}
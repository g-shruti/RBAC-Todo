type Sanitizable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Sanitizable[]
  | { [key: string]: Sanitizable };

const sanitizeKey = (key: string): string => key.replace(/\$/g, "").replace(/\./g, "");

export const sanitizeValue = (value: Sanitizable): Sanitizable => {
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce<Record<string, Sanitizable>>((accumulator, [key, nestedValue]) => {
      accumulator[sanitizeKey(key)] = sanitizeValue(nestedValue);
      return accumulator;
    }, {});
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return value;
};

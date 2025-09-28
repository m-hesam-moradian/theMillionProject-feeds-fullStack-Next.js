export function transferLocalStorageToCookie(keys: string[]): object | null {
  if (typeof window === "undefined") return null;

  for (const key of keys) {
    const rawValue = localStorage.getItem(key);
    if (rawValue) {
      try {
        const parsedValue = JSON.parse(rawValue); // Convert JSON string to JS object
        document.cookie = `${key}=${encodeURIComponent(rawValue)}; path=/;`; // Still store raw string in cookie
        return parsedValue; // Return as JS object
      } catch (err) {
        console.error(
          `Failed to parse localStorage value for key "${key}":`,
          err
        );
        return null;
      }
    }
  }

  return null; // If none found
}

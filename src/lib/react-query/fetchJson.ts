/** Client `queryFn` helper for the app's own cached JSON routes. Throws so React Query can retry. */
export const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Request to ${path} failed (${response.status})`);
  return response.json() as Promise<T>;
};

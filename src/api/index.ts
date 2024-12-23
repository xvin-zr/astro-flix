import { QueryClient } from "@tanstack/react-query";

export const base = "https://api.movies.tastejs.com";
const media_base = "https://image.tmdb.org/t/p";

export const queryClient = new QueryClient();

async function get<T = unknown>(
  fetch: typeof globalThis.fetch,
  endpoint: string,
  params?: Record<string, string>
): Promise<T> {
  const q = new URLSearchParams(params);
  return await fetch(`${base}/${endpoint}?${q}`).then((res) => res.json());
}

export function media(file_path: string, width: number) {
  return `${media_base}/w${width}${file_path}`;
}

const api = {
  get,
};

export default api;

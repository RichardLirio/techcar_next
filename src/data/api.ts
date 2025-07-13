import { env } from "@/env/env";

//criando requisição padrão com o backend
export function api(path: string, init?: RequestInit) {
  const baseUrl = env.NEXT_PUBLIC_API_URL || "http://localhost:3333";
  const url = new URL(`/api/v1/${path}`, baseUrl);

  return fetch(url, init);
}

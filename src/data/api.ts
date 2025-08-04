import { env } from "@/env/env";

//criando requisição padrão com o backend
export function api(path: string, init?: RequestInit) {
  const isServer = typeof window === "undefined";
  const baseUrl = isServer
    ? env.INTERNAL_API_URL || "http://api:3333" // Dentro do container
    : env.NEXT_PUBLIC_API_URL || "http://localhost:3333"; // No navegador

  const url = new URL(`/api/v1/${path}`, baseUrl);

  return fetch(url.toString(), init);
}

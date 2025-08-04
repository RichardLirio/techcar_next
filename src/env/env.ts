import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  INTERNAL_API_URL: z.string().url().optional(),
});

const parsedEnv = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  INTERNAL_API_URL: process.env.INTERNAL_API_URL,
});

if (!parsedEnv.success) {
  console.error(
    "❌ Variáveis de ambiente inválidas:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Erro nas variáveis de ambiente.");
}

export const env = parsedEnv.data;

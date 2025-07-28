import { z } from "zod";

export const userProfile = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
  createdAt: z.date(),
}); // // Definindo o esquema para os parâmetros da requisição usando Zod

export type ProfileLogin = z.infer<typeof userProfile>;

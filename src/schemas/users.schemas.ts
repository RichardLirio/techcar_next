import z from "zod";

// User schemas
export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  name: z.string().min(1, "Nome é obrigatório").toUpperCase(),
  role: z.enum(["ADMIN", "USER"]),
});

export const updateUserSchema = z.object({
  email: z.string().email("Email inválido").optional(),
  password: z
    .string()
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .optional(),
  name: z.string().min(1, "Nome é obrigatório").toUpperCase().optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

export const fetchUserSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["USER", "ADMIN"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type FetchUserData = z.infer<typeof fetchUserSchema>;

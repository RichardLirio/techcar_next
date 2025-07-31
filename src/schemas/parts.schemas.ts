import z from "zod";

// Part schemas
export const partSchema = z.object({
  id: z.string().uuid(),
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .transform((val) => val.toUpperCase()),
  quantity: z.number().int().min(0, "Quantidade deve ser maior ou igual a 0"),
  unitPrice: z
    .number()
    .min(0, "Preço deve ser positivo")
    .transform((val) => Number(val.toFixed(2))), // Arredonda corretamente
  description: z
    .string()
    .transform((val) => val.toUpperCase())
    .optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const createPartSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .transform((val) => val.toUpperCase()),
  quantity: z.number().int().min(0, "Quantidade deve ser maior ou igual a 0"),
  unitPrice: z
    .number()
    .min(0, "Preço deve ser positivo")
    .transform((val) => Number(val.toFixed(2))), // Arredonda corretamente
  description: z
    .string()
    .transform((val) => val.toUpperCase())
    .optional(),
});

export const updatePartSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").toUpperCase().optional(),
  quantity: z
    .number()
    .int()
    .min(0, "Quantidade deve ser maior ou igual a 0")
    .optional(),
  unitPrice: z.number().positive("Preço unitário deve ser positivo").optional(),
  description: z.string().toUpperCase().optional(),
});

export type CreatePartInput = z.infer<typeof createPartSchema>;
export type UpdatePartInput = z.infer<typeof updatePartSchema>;
export type Part = z.infer<typeof partSchema>;

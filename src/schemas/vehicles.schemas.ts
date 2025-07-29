import { formatarPlaca } from "@/utils/normalize";
import z from "zod";

// Vehicle schemas
export const vehicleSchema = z.object({
  plate: z.string(),
  model: z.string(),
  brand: z.string(),
  kilometers: z.number(),
  year: z.number().nullable(),
  clientId: z.string(),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createVehicleSchema = z.object({
  plate: z.string().min(1, "Placa é obrigatória").transform(formatarPlaca),
  model: z.string().min(1, "Modelo é obrigatório").toUpperCase(),
  brand: z.string().min(1, "Marca é obrigatória").toUpperCase(),
  kilometers: z.coerce.number().min(1, "Quilometragem é obrigatória"),
  year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  clientId: z.string().min(1, "Cliente é obrigatório"),
});

export const updateVehicleSchema = z.object({
  plate: z
    .string()
    .min(1, "Placa é obrigatória")
    .transform(formatarPlaca)
    .optional(),
  model: z.string().min(1, "Modelo é obrigatório").toUpperCase().optional(),
  brand: z.string().min(1, "Marca é obrigatória").toUpperCase().optional(),
  kilometers: z.number().min(1, "Quilometragem é obrigatória"),
  year: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  clientId: z.string().min(1, "Cliente é obrigatório").optional(),
});

const fetchVehicleSchema = z.object({
  plate: z.string(),
  model: z.string(),
  brand: z.string(),
  kilometers: z.number(),
  year: z.number().nullable(),
  clientId: z.string(),
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  client: z.object({
    id: z.string().uuid(),
    name: z.string(),
    cpfCnpj: z.string(),
  }),
  _count: z.object({
    oders: z.number(),
  }),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type Vehicle = z.infer<typeof vehicleSchema>;
export type FetchVehicleData = z.infer<typeof fetchVehicleSchema>;

import z from "zod";
import { cpfCnpjValidation } from "./validation";
import { formatCpfCnpj } from "@/utils/normalize";
import { vehicleSchema } from "./vehicles.schemas";

// Client schemas
export const createClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").toUpperCase(),
  cpfCnpj: cpfCnpjValidation.transform(formatCpfCnpj),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  address: z.string().optional(),
});

export const updateClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").toUpperCase().optional(),
  cpfCnpj: cpfCnpjValidation.transform(formatCpfCnpj).optional(),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  address: z.string().optional(),
});

export const fetchClientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cpfCnpj: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  address: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  vehicles: z.array(vehicleSchema),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type FetchClientData = z.infer<typeof fetchClientSchema>;

//  clients: ({
//     vehicles: {
//         plate: string;
//         model: string;
//         brand: string;
//         kilometers: number;
//         year: number | null;
//         clientId: string;
//         id: string;
//         createdAt: Date;
//         updatedAt: Date;
//     }[];
//     _count: {
//         orders: number;
//     };
// } & {
//     name: string;
//     cpfCnpj: string;
//     phone: string | null;
//     email: string | null;
//     address: string | null;
//     id: string;
//     createdAt: Date;
//     updatedAt: Date;
// })[]

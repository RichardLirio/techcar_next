import { formatCpfCnpj } from "@/utils/formata.cpfCnpj";
import { z } from "zod";
import { cpfCnpjValidation } from "./validation";

export const createClientSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").toUpperCase(),
  cpfCnpj: cpfCnpjValidation.transform(formatCpfCnpj),
  phone: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  address: z.string().optional(),
});

export type CreateClientData = z.infer<typeof createClientSchema>;

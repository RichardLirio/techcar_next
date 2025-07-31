import z from "zod";

// Order schemas
export const serviceSchema = z.object({
  description: z.string().min(1, "Descrição é obrigatória").toUpperCase(),
  price: z
    .number()
    .min(0, "Preço deve ser positivo")
    .transform((val) => Number(val.toFixed(2))), // Arredonda corretamente
});

export const orderItemSchema = z.object({
  partId: z.string().min(1, "Peça é obrigatória"),
  quantity: z.number().int().positive("Quantidade deve ser positiva"),
  unitPrice: z
    .number()
    .min(0, "Preço deve ser positivo")
    .transform((val) => Number(val.toFixed(2))), // Arredonda corretamente
});

export const createOrderSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório"),
  vehicleId: z.string().min(1, "Veículo é obrigatório"),
  orderId: z.string().min(1, "Veículo é obrigatório"),
  description: z.string().toUpperCase().optional(),
  kilometers: z.number().min(1, "Quilometragem é obrigatória"),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  discount: z
    .number()
    .min(0, "Desconto deve ser maior ou igual a 0")
    .default(0),
});

export const updateOrderSchema = z.object({
  clientId: z.string().min(1, "Cliente é obrigatório").optional(),
  vehicleId: z.string().min(1, "Veículo é obrigatório").optional(),
  orderId: z.string().min(1, "Veículo é obrigatório").optional(),
  description: z.string().toUpperCase().optional(),
  kilometers: z.number().min(1, "Quilometragem é obrigatória").optional(),
  discount: z
    .number()
    .min(0, "Desconto deve ser maior ou igual a 0")
    .optional(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
});

export const fetchOrderSchema = z.object({
  id: z.string().uuid(),
  clientId: z.string().uuid(),
  vehicleId: z.string().uuid(),
  orderId: z.string().uuid(),
  status: z.enum(["IN_PROGRESS", "COMPLETED", "CANCELLED"]).optional(),
  description: z.string().toUpperCase().optional(),
  kilometers: z.number(),
  discount: z.coerce.number(),
  totalValue: z.coerce.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  client: z.object({
    id: z.string().uuid(),
    name: z.string(),
    cpfCnpj: z.string(),
  }),
  vehicle: z.object({
    id: z.string().uuid(),
    plate: z.string(),
    model: z.string().optional(),
    brand: z.string().optional(),
  }),
  services: z.array(
    z.object({
      id: z.string().uuid(),
      orderId: z.string().uuid(),
      description: z.string(),
      price: z.coerce.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  items: z.array(
    z.object({
      id: z.string().uuid(),
      orderId: z.string().uuid(),
      partId: z.string().uuid(),
      quantity: z.number(),
      unitPrice: z.coerce.number(),
      createdAt: z.date(),
      updatedAt: z.date(),
      part: z.object({
        id: z.string().uuid(),
        name: z.string(),
      }),
    })
  ),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type FetchOrderData = z.infer<typeof fetchOrderSchema>;

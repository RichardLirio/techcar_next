"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Printer,
  Calendar,
  User,
  Car,
  FileText,
  Package,
  DollarSign,
  Settings,
  MapPin,
  Phone,
  Mail,
  Hash,
  Gauge,
  Tag,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { toast } from "sonner";
import { api } from "@/data/api";

// Tipos baseados nos schemas
interface OrderData {
  id: string;
  clientId: string;
  vehicleId: string;
  orderId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  description?: string;
  kilometers: number;
  discount: number;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    name: string;
    cpfCnpj: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  vehicle: {
    id: string;
    plate: string;
    model?: string;
    brand?: string;
    year?: number;
  };
  services: Array<{
    id: string;
    orderId: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
  }>;
  items: Array<{
    id: string;
    orderId: string;
    partId: string;
    quantity: number;
    unitPrice: number;
    createdAt: string;
    updatedAt: string;
    part: {
      id: string;
      name: string;
    };
  }>;
}

// Função para imprimir a ordem (reutilizada do exemplo)
async function printOrderAction(id: string) {
  const response = await api(`orders/${id}/pdf`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Erro ao buscar o PDF");
  }

  const pdfBlob = await response.blob();
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
  setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

  return { success: true };
}

// Função para formatar valores em BRL
function formatToBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Configuração dos status
const getStatusConfig = (status: string) => {
  const statusConfig = {
    IN_PROGRESS: {
      label: "Em Andamento",
      className:
        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      dotColor: "bg-blue-500",
    },
    COMPLETED: {
      label: "Concluído",
      className:
        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
      dotColor: "bg-green-500",
    },
    CANCELLED: {
      label: "Cancelado",
      className:
        "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
      dotColor: "bg-red-500",
    },
  };

  return (
    statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className:
        "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800",
      dotColor: "bg-gray-500",
    }
  );
};

export default function OrderViewPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [printLoading, setPrintLoading] = useState(false);

  const orderId = params.id as string;

  // Dados mockados para demonstração
  useEffect(() => {
    // Simular carregamento dos dados
    const mockOrder: OrderData = {
      id: orderId,
      clientId: "client-123",
      vehicleId: "vehicle-456",
      orderId: `OS-${orderId}`,
      status: "IN_PROGRESS",
      description: "REVISÃO COMPLETA E TROCA DE ÓLEO",
      kilometers: 45000,
      discount: 50.0,
      totalValue: 450.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      client: {
        id: "client-123",
        name: "João Silva Santos",
        cpfCnpj: "123.456.789-00",
        phone: "(11) 99999-8888",
        email: "joao.silva@email.com",
        address: "Rua das Flores, 123 - Centro - São Paulo/SP",
      },
      vehicle: {
        id: "vehicle-456",
        plate: "ABC-1234",
        model: "Civic",
        brand: "Honda",
        year: 2020,
      },
      services: [
        {
          id: "service-1",
          orderId: orderId,
          description: "TROCA DE ÓLEO E FILTRO",
          price: 120.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "service-2",
          orderId: orderId,
          description: "REVISÃO SISTEMA DE FREIOS",
          price: 180.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "service-3",
          orderId: orderId,
          description: "ALINHAMENTO E BALANCEAMENTO",
          price: 100.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      items: [
        {
          id: "item-1",
          orderId: orderId,
          partId: "part-1",
          quantity: 4,
          unitPrice: 25.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          part: {
            id: "part-1",
            name: "ÓLEO MOTOR 5W30",
          },
        },
        {
          id: "item-2",
          orderId: orderId,
          partId: "part-2",
          quantity: 1,
          unitPrice: 35.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          part: {
            id: "part-2",
            name: "FILTRO DE ÓLEO",
          },
        },
        {
          id: "item-3",
          orderId: orderId,
          partId: "part-3",
          quantity: 4,
          unitPrice: 15.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          part: {
            id: "part-3",
            name: "PASTILHA DE FREIO",
          },
        },
      ],
    };

    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [orderId]);

  const handlePrint = async () => {
    if (!order) return;

    setPrintLoading(true);
    try {
      await printOrderAction(order.id);
      toast.success("PDF gerado com sucesso!");
    } catch (error) {
      toast.error("Erro ao gerar PDF da ordem de serviço");
    } finally {
      setPrintLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground">
            Carregando ordem de serviço...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Ordem não encontrada</h2>
          <p className="text-muted-foreground">
            A ordem de serviço solicitada não foi encontrada.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(order.status);
  const servicesTotal = order.services.reduce(
    (sum, service) => sum + service.price,
    0
  );
  const itemsTotal = order.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const subtotal = servicesTotal + itemsTotal;
  const finalTotal = subtotal - order.discount;

  return (
    <>
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Ordem de Serviço</h1>
                <p className="text-muted-foreground">#{order.orderId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${statusConfig.className} px-3 py-1`}>
                <div
                  className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-2`}
                ></div>
                {statusConfig.label}
              </Badge>
              <Button onClick={handlePrint} disabled={printLoading}>
                <Printer className="h-4 w-4 mr-2" />
                {printLoading ? "Gerando PDF..." : "Imprimir"}
              </Button>
            </div>
          </div>

          {/* Informações Gerais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold text-lg">{order.client.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span>{order.client.cpfCnpj}</span>
                  </div>
                  {order.client.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{order.client.phone}</span>
                    </div>
                  )}
                  {order.client.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{order.client.email}</span>
                    </div>
                  )}
                  {order.client.address && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="break-words">
                        {order.client.address}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Informações do Veículo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Informações do Veículo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-semibold text-lg font-mono">
                    {order.vehicle.plate}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>
                      {order.vehicle.brand} {order.vehicle.model}
                    </span>
                    {order.vehicle.year && <span>({order.vehicle.year})</span>}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gauge className="h-4 w-4" />
                    <span>{order.kilometers.toLocaleString()} km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detalhes da Ordem */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detalhes da Ordem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Criada em:</strong>{" "}
                    {format(
                      new Date(order.createdAt),
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    <strong>Atualizada em:</strong>{" "}
                    {format(
                      new Date(order.updatedAt),
                      "dd/MM/yyyy 'às' HH:mm",
                      { locale: ptBR }
                    )}
                  </span>
                </div>
              </div>
              {order.description && (
                <div>
                  <p className="text-sm font-medium mb-2">Descrição:</p>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                    {order.description}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Serviços Executados
              </CardTitle>
              <CardDescription>
                Lista de serviços realizados nesta ordem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.services.map((service, index) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{service.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Serviço #{index + 1}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatToBRL(service.price)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total dos Serviços:</span>
                  <span>{formatToBRL(servicesTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Peças e Materiais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Peças e Materiais
              </CardTitle>
              <CardDescription>
                Lista de peças utilizadas nesta ordem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-md"
                  >
                    <div>
                      <p className="font-medium">{item.part.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qtd: {item.quantity} × {formatToBRL(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatToBRL(item.quantity * item.unitPrice)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>Total das Peças:</span>
                  <span>{formatToBRL(itemsTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Financeiro */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Resumo Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Subtotal (Serviços + Peças):</span>
                  <span>{formatToBRL(subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex items-center justify-between text-green-600">
                    <span>Desconto:</span>
                    <span>- {formatToBRL(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Final:</span>
                  <span className="text-primary">
                    {formatToBRL(finalTotal)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal de Loading para impressão */}
      <Dialog open={printLoading} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Gerando PDF</DialogTitle>
            <DialogDescription className="flex items-center gap-3">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              <span>
                Aguarde enquanto o PDF da ordem de serviço está sendo gerado...
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

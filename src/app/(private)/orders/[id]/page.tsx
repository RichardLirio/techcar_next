// app/orders/[id]/page.tsx
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
  ArrowLeft,
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
import { notFound } from "next/navigation";
import { formatToBRL } from "@/utils/formatToBrl";
import { PrintOrderButton } from "./_components/print.order.button";
import Link from "next/link";
import { cookies } from "next/headers";
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

interface OrderPageProps {
  id: string;
}

export default async function OrderViewPage({
  params,
}: Readonly<{
  params: Promise<OrderPageProps>;
}>) {
  const param = await params;
  const orderId = param.id;
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`orders/${orderId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!result.success || !result.data?.order) {
    notFound();
  }

  const order: OrderData = result.data.order;

  const statusConfig = getStatusConfig(order.status);
  const servicesTotal = order.services.reduce(
    (sum: number, s: any) => sum + Number(s.price),
    0
  );
  const itemsTotal = order.items.reduce(
    (sum: number, i: any) => sum + Number(i.quantity) * Number(i.unitPrice),
    0
  );
  const subtotal = servicesTotal + itemsTotal;
  const finalTotal = subtotal - order.discount;
  console.log(order.orderId);
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Ordem de Serviço</h1>
              <p className="text-muted-foreground">#{order.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${statusConfig.className} px-3 py-1`}>
              <div
                className={`w-2 h-2 rounded-full ${statusConfig.dotColor} mr-2`}
              ></div>
              {statusConfig.label}
            </Badge>
            <PrintOrderButton orderId={order.id} />
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
                    <span className="break-words">{order.client.address}</span>
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
                  {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  <strong>Atualizada em:</strong>{" "}
                  {format(new Date(order.updatedAt), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
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
                <span className="text-primary">{formatToBRL(finalTotal)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demais cards: Cliente, Veículo, Detalhes, Serviços, Peças, Resumo */}
        {/* Pode manter os cards exatamente como estão no seu código original */}

        {/* ...copie o conteúdo renderizado do seu componente anterior aqui... */}
      </div>
    </div>
  );
}

function getStatusConfig(status: string) {
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
}

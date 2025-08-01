"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  Car,
  Package,
  AlertTriangle,
  FileText,
  DollarSign,
  Eye,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Tipos baseados nos schemas fornecidos
interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Vehicle {
  id: string;
  plate: string;
  model: string;
  brand: string;
  kilometers: number;
  year: number | null;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string;
    cpfCnpj: string;
  };
}

interface Part {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  clientId: string;
  vehicleId: string;
  orderId: string;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  description?: string;
  kilometers: number;
  discount: number;
  totalValue: number;
  createdAt: Date;
  updatedAt: Date;
  client: {
    id: string;
    name: string;
    cpfCnpj: string;
  };
  vehicle: {
    id: string;
    plate: string;
    model?: string;
    brand?: string;
  };
  services: Array<{
    id: string;
    orderId: string;
    description: string;
    price: number;
    createdAt: Date;
    updatedAt: Date;
  }>;
  items: Array<{
    id: string;
    orderId: string;
    partId: string;
    quantity: number;
    unitPrice: number;
    createdAt: Date;
    updatedAt: Date;
    part: {
      id: string;
      name: string;
    };
  }>;
}

interface DashboardPageProps {
  orders: Order[];
  clients: Client[];
  vehicles: Vehicle[];
  parts: Part[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "COMPLETED":
      return "bg-green-100 text-green-800 border-green-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "IN_PROGRESS":
      return "Em Andamento";
    case "COMPLETED":
      return "Concluída";
    case "CANCELLED":
      return "Cancelada";
    default:
      return status;
  }
};

export default function DashboardPage({
  orders,
  clients,
  vehicles,
  parts,
}: DashboardPageProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const ordersPerPage = 10;
  const router = useRouter();

  // Cálculos dos dados
  const totalClients = clients.length;
  const totalVehicles = vehicles.length;
  const totalParts = parts.length;
  const lowStockParts = parts.filter((part) => part.quantity < 10).length;
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((order) => order.status === "COMPLETED")
    .reduce((sum, order) => sum + Number(order.totalValue), 0);

  // Ordenar ordens por data mais recente
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Calcular paginação
  const totalPages = Math.ceil(sortedOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = sortedOrders.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clientes
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalClients}</div>
              <p className="text-xs text-muted-foreground">
                Clientes cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Veículos
              </CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVehicles}</div>
              <p className="text-xs text-muted-foreground">
                Veículos cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Peças</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalParts}</div>
              <p className="text-xs text-muted-foreground">Peças em estoque</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Estoque Baixo
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {lowStockParts}
              </div>
              <p className="text-xs text-muted-foreground">
                Peças com menos de 10
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ordens de Serviço
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">Total de ordens</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R${" "}
                {totalRevenue.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <p className="text-xs text-muted-foreground">Ordens concluídas</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Ordens de Serviço Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ordens de Serviço Recentes
            </CardTitle>
            <CardDescription>
              Últimas ordens de serviço cadastradas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">
                        {order.orderId}
                      </span>
                      <Badge
                        className={`text-xs ${getStatusColor(order.status)}`}
                      >
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{order.client.name}</span> •{" "}
                      <span>
                        {order.vehicle.brand} {order.vehicle.model}
                      </span>{" "}
                      • <span className="font-mono">{order.vehicle.plate}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                      <span>{order.kilometers.toLocaleString()} km</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-semibold">
                        R${" "}
                        {Number(order.totalValue).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      {order.discount > 0 && (
                        <div className="text-xs text-green-600">
                          Desc: R${" "}
                          {Number(order.discount).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/orders/${order.id}`)} // Navigate to order details
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginação */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a{" "}
                {Math.min(endIndex, sortedOrders.length)} de{" "}
                {sortedOrders.length} ordens
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-sm font-medium px-3">
                  {currentPage} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

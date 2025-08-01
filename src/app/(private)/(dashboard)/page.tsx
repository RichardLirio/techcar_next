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

// Dados mockados para demonstração
const mockClients: Client[] = Array.from({ length: 25 }, (_, i) => ({
  id: `client-${i}`,
  name: `Cliente ${i + 1}`,
  cpfCnpj: `000.000.00${i.toString().padStart(2, "0")}-00`,
  phone: `(11) 9999${i.toString().padStart(4, "0")}`,
  email: `cliente${i + 1}@email.com`,
  address: `Rua das Flores, ${i + 100}`,
  createdAt: new Date(2024, 0, i + 1),
  updatedAt: new Date(2024, 0, i + 1),
}));

const mockVehicles: Vehicle[] = Array.from({ length: 40 }, (_, i) => ({
  id: `vehicle-${i}`,
  plate: `ABC-${(1000 + i).toString()}`,
  model: ["Civic", "Corolla", "Gol", "Onix", "HB20"][i % 5],
  brand: ["Honda", "Toyota", "Volkswagen", "Chevrolet", "Hyundai"][i % 5],
  kilometers: 10000 + i * 1000,
  year: 2015 + (i % 9),
  clientId: `client-${i % 25}`,
  createdAt: new Date(2024, 0, i + 1),
  updatedAt: new Date(2024, 0, i + 1),
  client: {
    id: `client-${i % 25}`,
    name: `Cliente ${(i % 25) + 1}`,
    cpfCnpj: `000.000.00${(i % 25).toString().padStart(2, "0")}-00`,
  },
}));

const mockParts: Part[] = Array.from({ length: 150 }, (_, i) => ({
  id: `part-${i}`,
  name: [
    "ÓLEO MOTOR",
    "FILTRO AR",
    "PASTILHA FREIO",
    "VELA IGNIÇÃO",
    "CORREIA DENTADA",
  ][i % 5],
  quantity: Math.floor(Math.random() * 50),
  unitPrice: 25.9 + i * 5.5,
  description: `Descrição da peça ${i + 1}`,
  createdAt: new Date(2024, 0, i + 1),
  updatedAt: new Date(2024, 0, i + 1),
}));

const mockOrders: Order[] = Array.from({ length: 75 }, (_, i) => ({
  id: `order-${i}`,
  clientId: `client-${i % 25}`,
  vehicleId: `vehicle-${i % 40}`,
  orderId: `OS-${(2024000 + i).toString()}`,
  status: ["IN_PROGRESS", "COMPLETED", "CANCELLED"][i % 3] as
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED",
  description: `Serviço de manutenção ${i + 1}`,
  kilometers: 10000 + i * 1000,
  discount: Math.floor(Math.random() * 100),
  totalValue: 150.0 + i * 25.75,
  createdAt: new Date(2024, Math.floor(i / 10), (i % 28) + 1),
  updatedAt: new Date(2024, Math.floor(i / 10), (i % 28) + 1),
  client: {
    id: `client-${i % 25}`,
    name: `Cliente ${(i % 25) + 1}`,
    cpfCnpj: `000.000.00${(i % 25).toString().padStart(2, "0")}-00`,
  },
  vehicle: {
    id: `vehicle-${i % 40}`,
    plate: `ABC-${(1000 + (i % 40)).toString()}`,
    model: ["Civic", "Corolla", "Gol", "Onix", "HB20"][i % 5],
    brand: ["Honda", "Toyota", "Volkswagen", "Chevrolet", "Hyundai"][i % 5],
  },
  services: [
    {
      id: `service-${i}`,
      orderId: `order-${i}`,
      description: "TROCA DE ÓLEO",
      price: 80.0,
      createdAt: new Date(2024, Math.floor(i / 10), (i % 28) + 1),
      updatedAt: new Date(2024, Math.floor(i / 10), (i % 28) + 1),
    },
  ],
  items: [
    {
      id: `item-${i}`,
      orderId: `order-${i}`,
      partId: `part-${i % 150}`,
      quantity: 1,
      unitPrice: 25.9,
      createdAt: new Date(2024, Math.floor(i / 10), (i % 28) + 1),
      updatedAt: new Date(2024, Math.floor(i / 10), (i % 28) + 1),
      part: {
        id: `part-${i % 150}`,
        name: [
          "ÓLEO MOTOR",
          "FILTRO AR",
          "PASTILHA FREIO",
          "VELA IGNIÇÃO",
          "CORREIA DENTADA",
        ][i % 5],
      },
    },
  ],
}));

// Cálculos dos dados
const totalClients = mockClients.length;
const totalVehicles = mockVehicles.length;
const totalParts = mockParts.length;
const lowStockParts = mockParts.filter((part) => part.quantity < 10).length;
const totalOrders = mockOrders.length;
const totalRevenue = mockOrders
  .filter((order) => order.status === "COMPLETED")
  .reduce((sum, order) => sum + order.totalValue, 0);

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

export default function DashboardPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const ordersPerPage = 10;

  // Ordenar ordens por data mais recente
  const sortedOrders = [...mockOrders].sort(
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
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Dashboard TechCar
          </h1>
          <p className="text-muted-foreground">
            Visão geral do seu sistema de gestão automotiva
          </p>
        </div>

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
                        {order.totalValue.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      {order.discount > 0 && (
                        <div className="text-xs text-green-600">
                          Desc: R${" "}
                          {order.discount.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
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

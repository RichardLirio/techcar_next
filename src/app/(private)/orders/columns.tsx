"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteOrderAction } from "@/app/actions/order.actions";
import { ServiceOrderDialog } from "@/components/order-dialog";
import { FetchOrderData } from "@/schemas/order.schemas";
import { FetchClientData } from "@/schemas/clients.schemas";
import { Vehicle } from "@/schemas/vehicles.schemas";
import { Part } from "@/schemas/parts.schemas";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { api } from "@/data/api";

export async function printOrderAction(id: string) {
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

function formatToBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export const createColumns = (
  clients: FetchClientData[],
  vehicles: Vehicle[],
  parts: Part[]
): ColumnDef<FetchOrderData>[] => [
  {
    id: "clientName",
    accessorFn: (row) => row.client.name,
    header: "Cliente",
    cell: ({ row }) => row.original.client.name,
  },
  {
    id: "vehiclePlate",
    accessorFn: (row) => row.vehicle.plate,
    header: "Placa",
    cell: ({ row }) => row.original.vehicle.plate,
  },
  {
    accessorKey: "totalValue",
    header: "Total",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("totalValue"));
      return <div className="font-medium">{formatToBRL(price)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const statusConfig = {
        IN_PROGRESS: {
          label: "Em Andamento",
          className: "bg-blue-100 text-blue-800 border-blue-200",
          dotColor: "bg-blue-500",
        },
        COMPLETED: {
          label: "Concluído",
          className: "bg-green-100 text-green-800 border-green-200",
          dotColor: "bg-green-500",
        },
        CANCELLED: {
          label: "Cancelado",
          className: "bg-red-100 text-red-800 border-red-200",
          dotColor: "bg-red-500",
        },
      };

      const config = statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        className: "bg-gray-100 text-gray-800 border-gray-200",
        dotColor: "bg-gray-500",
      };

      return (
        <div
          className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
        >
          <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
          {config.label}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criada em",
    cell: ({ row }) => {
      const value = row.getValue("createdAt") as string;
      const date = new Date(value);
      return format(date, "dd/MM/yyyy", { locale: ptBR });
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const order = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [editDialogOpen, setEditDialogOpen] = useState(false);
      const [loadingDialogOpen, setLoadingDialogOpen] = useState(false); // Estado para o modal de carregamento

      async function handleDeleteOrder() {
        try {
          await deleteOrderAction(order.id);
          toast.success("Ordem de serviço excluída com sucesso");
        } catch (err) {
          toast.error("Erro ao excluir a ordem de serviço");
        } finally {
          setDeleteDialogOpen(false);
        }
      }

      async function handlePrintOrder() {
        setLoadingDialogOpen(true); // Abre o modal de carregamento
        try {
          await printOrderAction(order.id);
          toast.success("Ordem de serviço gerada com sucesso");
        } catch (err) {
          toast.error("Erro ao imprimir a ordem de serviço");
        } finally {
          setLoadingDialogOpen(false); // Fecha o modal de carregamento
        }
      }

      function handleEditSuccess() {
        setEditDialogOpen(false);
        toast.success("Ordem de serviço editada com sucesso");
      }

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handlePrintOrder}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-red-600"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dialog de edição */}
          <ServiceOrderDialog
            mode="edit"
            serviceOrder={{
              id: order.id,
              clientId: order.clientId,
              vehicleId: order.vehicleId,
              description: order.description ? order.description : "",
              kilometers: order.kilometers,
              discount: order.discount,
              status: order.status ? order.status : "IN_PROGRESS",
              services: order.services,
              items: order.items,
            }}
            clients={clients}
            vehicles={vehicles}
            parts={parts}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={handleEditSuccess}
          />

          {/* Dialog de confirmação de exclusão */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar exclusão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir a ordem de serviço{" "}
                  <strong>{order.id}</strong>? Esta ação não poderá ser
                  desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteOrder}>
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal de carregamento */}
          <Dialog open={loadingDialogOpen} onOpenChange={setLoadingDialogOpen}>
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
                    Aguarde enquanto o PDF da ordem de serviço está sendo
                    gerado...
                  </span>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </>
      );
    },
  },
];

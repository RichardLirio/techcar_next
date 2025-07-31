"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
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

function formatToBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Função que retorna as colunas com os dados necessários
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
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const order = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [editDialogOpen, setEditDialogOpen] = useState(false);

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

          {/* Dialog de confirmação */}
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
        </>
      );
    },
  },
];

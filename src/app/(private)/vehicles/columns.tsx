"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreHorizontal, SquareUserRound, Trash2 } from "lucide-react";
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
import { FetchVehicleData } from "@/schemas/vehicles.schemas";
import { deleteVehicleAction } from "@/app/actions/vehicles.actions";
import { VehicleDialog } from "@/components/vehicle-dialog";

export const columns: ColumnDef<FetchVehicleData>[] = [
  {
    accessorKey: "plate",
    header: "Placa",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "model",
    header: "Modelo",
  },
  {
    accessorKey: "year",
    header: "Ano",
  },
  {
    accessorKey: "kilometers",
    header: "KM",
  },
  {
    accessorKey: "client.name",
    header: "Cliente",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const vehicle = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [editDialogOpen, setEditDialogOpen] = useState(false);

      async function handleDeleteVehicle() {
        try {
          await deleteVehicleAction(vehicle.id);
          toast.success("Veículo excluído com sucesso");
        } catch (err) {
          toast.error("Erro ao excluir o veículo");
        } finally {
          setDeleteDialogOpen(false);
        }
      }

      function handleEditSuccess() {
        setEditDialogOpen(false);
        toast.success("Veículo editado com sucesso");
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

              {/** TODO: Criar paragina para vizualizar detalhes do veiculo, como ordens de serviços*/}
              <DropdownMenuItem>
                <SquareUserRound className="mr-2 h-4 w-4" />
                Detalhes
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
          <VehicleDialog
            mode="edit"
            vehicle={{
              plate: vehicle.plate,
              model: vehicle.model,
              brand: vehicle.brand,
              kilometers: vehicle.kilometers,
              year: vehicle.year ? vehicle.year : 0,
              clientId: vehicle.clientId,
              id: vehicle.id,
              createdAt: vehicle.createdAt,
              updatedAt: vehicle.updatedAt,
            }}
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
                  Tem certeza que deseja excluir o veículo de placa{" "}
                  <strong>{vehicle.plate}</strong>? Esta ação não poderá ser
                  desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteVehicle}>
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

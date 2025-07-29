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
import { FetchClientData } from "@/schemas/clients.schemas";
import { deleteClienteAction } from "@/app/actions/clients.actions";
import { ClientDialog } from "@/components/client-dialog";

export const columns: ColumnDef<FetchClientData>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "cpfCnpj",
    header: "Cpf/Cnpj",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "address",
    header: "Endereço",
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const client = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [editDialogOpen, setEditDialogOpen] = useState(false);

      async function handleDeleteClient() {
        try {
          await deleteClienteAction(client.id);
          toast.success("Cliente excluído com sucesso");
        } catch (err) {
          toast.error("Erro ao excluir o cliente");
        } finally {
          setDeleteDialogOpen(false);
        }
      }

      function handleEditSuccess() {
        setEditDialogOpen(false);
        toast.success("Cliente editado com sucesso");
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
          <ClientDialog
            mode="edit"
            client={{
              id: client.id,
              name: client.name,
              cpfCnpj: client.cpfCnpj,
              phone: client.phone ? client.phone : "",
              email: client.email ? client.email : "",
              address: client.address ? client.address : "",
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
                  Tem certeza que deseja excluir o cliente{" "}
                  <strong>{client.name}</strong>? Esta ação não poderá ser
                  desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteClient}>
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

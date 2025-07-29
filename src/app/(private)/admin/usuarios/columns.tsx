"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
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
import { deleteUsuarioAction } from "@/app/actions/users.actions";
import { FetchUserData } from "@/schemas/users.schemas";
import { UserDialog } from "@/components/user-dialog";

export const columns: ColumnDef<FetchUserData>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Cargo",
    cell: ({ row }) => {
      const cargo = row.getValue("role") as string;
      const badgeStyle = cargo === "ADMIN" ? "bg-red-500" : "bg-blue-500";
      return (
        <span
          className={cn(
            "text-white px-2 py-1 rounded text-xs font-semibold",
            badgeStyle
          )}
        >
          {cargo}
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
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
      const user = row.original;
      const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
      const [editDialogOpen, setEditDialogOpen] = useState(false);

      async function handleDeleteUser() {
        try {
          await deleteUsuarioAction(user.id);
          toast.success("Usuário excluído com sucesso");
        } catch (err: any) {
          toast.error(err.message);
        } finally {
          setDeleteDialogOpen(false);
        }
      }

      function handleEditSuccess() {
        setEditDialogOpen(false);
        toast.success("Usuário editado com sucesso");
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
          <UserDialog
            mode="edit"
            user={{
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            }}
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
                  Tem certeza que deseja excluir o usuário{" "}
                  <strong>{user.name}</strong>? Esta ação não poderá ser
                  desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button variant="destructive" onClick={handleDeleteUser}>
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

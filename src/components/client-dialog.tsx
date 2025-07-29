import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { PlusCircle, Edit } from "lucide-react";
import { SuccessResponse } from "@/@types/response";
import {
  CreateClientInput,
  createClientSchema,
  UpdateClientInput,
  updateClientSchema,
} from "@/schemas/clients.schemas";
import {
  createClienteAction,
  updateClientAction,
} from "@/app/actions/clients.actions";

interface Client {
  id: string;
  name: string;
  cpfCnpj: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ClientDialogProps {
  mode?: "create" | "edit";
  client?: Client;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ClientDialog({
  mode = "create",
  client,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: ClientDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = mode === "edit";

  // Usar estado controlado se fornecido, senão usar estado interno
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateClientInput | UpdateClientInput>({
    resolver: zodResolver(isEditing ? updateClientSchema : createClientSchema),
    defaultValues:
      isEditing && client
        ? {
            name: client.name,
            cpfCnpj: client.cpfCnpj,
            phone: client.phone,
            email: client.email,
            address: client.address,
          }
        : undefined,
  });

  // Atualiza os valores do formulário quando o cliente muda (modo edição)
  useEffect(() => {
    if (isEditing && client) {
      setValue("name", client.name);
      setValue("cpfCnpj", client.cpfCnpj);
      setValue("phone", client.phone);
      setValue("email", client.email);
      setValue("address", client.address);
    }
  }, [client, isEditing, setValue]);

  async function handleSubmitClient(
    data: CreateClientInput | UpdateClientInput
  ) {
    try {
      let response: SuccessResponse;

      if (isEditing && client?.id) {
        // Para modo de edição, usar o tipo UpdateClientInput
        const updateData: UpdateClientInput = {
          name: data.name,
          cpfCnpj: data.cpfCnpj,
          phone: data.phone,
          email: data.email,
          address: data.address,
        };

        response = await updateClientAction(client.id, updateData);
      } else {
        // Para modo de criação, usar o tipo CreateClientInput
        response = await createClienteAction(data as CreateClientInput);
      }

      if (response.success) {
        setOpen(false);
        reset();
        onSuccess?.();
        return;
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  function handleInvalidForm(errors: any) {
    const messages = Object.values(errors).map((err: any) => err?.message);
    if (messages.length > 0) {
      toast.error(messages.join(" | "));
    }
  }

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);
    if (newOpen) {
      // Resetando o formulário quando abre
      if (isEditing && client) {
        reset({
          name: client.name,
          cpfCnpj: client.cpfCnpj,
          phone: client.phone,
          email: client.email,
          address: client.address,
        });
      } else {
        reset();
      }
    }
  }

  const defaultTrigger = (
    <Button variant={isEditing ? "outline" : "default"}>
      {isEditing ? (
        <>
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </>
      ) : (
        <>
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Cliente
        </>
      )}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* Só renderiza o trigger se não estiver sendo controlado externamente */}
      {controlledOpen === undefined && (
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      )}

      <DialogContent
        onInteractOutside={() => {
          if (isEditing && client) {
            reset({
              name: client.name,
              cpfCnpj: client.cpfCnpj,
              phone: client.phone,
              email: client.email,
              address: client.address,
            });
          } else {
            reset();
          }
        }}
        className="sm:max-w-lg sm:max-h-[60vh] w-full h-full"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Editar informações do cliente"
              : "Criar um novo cliente"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitClient, handleInvalidForm)}
          className="space-y-4 w-full h-full"
        >
          <div className="grid grid-cols-4 items-center text-right gap-3">
            {/* Nome */}
            <label htmlFor="nome" className="col-span-1 font-medium">
              Nome
            </label>
            <Input
              id="nome"
              className="col-span-3"
              {...register("name")}
              placeholder={errors.name?.message || "Digite o nome"}
            />

            {/* cpfCnpj */}
            <label htmlFor="cpfCnpj" className="col-span-1 font-medium">
              Cpf/Cnpj
            </label>
            <Input
              id="cpfCnpj"
              type="cpfCnpj"
              className="col-span-3"
              {...register("cpfCnpj")}
              placeholder={errors.cpfCnpj?.message || "Digite o Cpf ou Cnpj"}
            />

            {/* Email */}
            <label htmlFor="email" className="col-span-1 font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              className="col-span-3"
              {...register("email")}
              placeholder={errors.email?.message || "Digite o email"}
            />

            {/* Phone */}
            <label htmlFor="phone" className="col-span-1 font-medium">
              Telefone
            </label>
            <Input
              id="phone"
              type="phone"
              className="col-span-3"
              {...register("phone")}
              placeholder={errors.phone?.message || "Digite o telefone"}
            />

            {/* Address */}
            <label htmlFor="address" className="col-span-1 font-medium">
              Endereço
            </label>
            <Input
              id="address"
              type="address"
              className="col-span-3"
              {...register("address")}
              placeholder={
                errors.address?.message || "Digite o endereço (Não obrigatório)"
              }
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (isEditing && client) {
                    reset({
                      name: client.name,
                      cpfCnpj: client.cpfCnpj,
                      phone: client.phone,
                      email: client.email,
                      address: client.address,
                    });
                  } else {
                    reset();
                  }
                }}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Criar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  CreateUserInput,
  createUserSchema,
  UpdateUserInput,
  updateUserSchema,
} from "@/schemas/users.schemas";
import {
  createUsuarioAction,
  updateUsuarioAction,
} from "@/app/actions/users.actions";
import { SuccessResponse } from "@/@types/response";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

interface UserDialogProps {
  mode?: "create" | "edit";
  user?: User;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UserDialog({
  mode = "create",
  user,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: UserDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isEditing = mode === "edit";

  // Usar estado controlado se fornecido, senão usar estado interno
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const roles = [
    {
      descricao: "Administrador",
      role: "ADMIN" as const,
    },
    {
      descricao: "Usuario",
      role: "USER" as const,
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateUserInput | UpdateUserInput>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues:
      isEditing && user
        ? {
            name: user.name,
            email: user.email,
            role: user.role,
          }
        : undefined,
  });

  // Atualiza os valores do formulário quando o usuário muda (modo edição)
  useEffect(() => {
    if (isEditing && user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("role", user.role);
    }
  }, [user, isEditing, setValue]);

  async function handleSubmitUser(data: CreateUserInput | UpdateUserInput) {
    try {
      let response: SuccessResponse;

      if (isEditing && user?.id) {
        // Para modo de edição, usar o tipo UpdateUserInput
        const updateData: UpdateUserInput = {
          name: data.name,
          email: data.email,
          role: data.role,
          // Só inclui password se foi fornecida
          ...(data.password &&
            data.password.trim() !== "" && { password: data.password }),
        };

        response = await updateUsuarioAction(user.id, updateData);
      } else {
        // Para modo de criação, usar o tipo CreateUserInput
        response = await createUsuarioAction(data as CreateUserInput);
      }

      if (response.success) {
        toast.success(response.message);
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
      if (isEditing && user) {
        reset({
          name: user.name,
          email: user.email,
          role: user.role,
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
          Novo Usuário
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
          if (isEditing && user) {
            reset({
              name: user.name,
              email: user.email,
              role: user.role,
            });
          } else {
            reset();
          }
        }}
        className="sm:max-w-md sm:max-h-[50vh] w-full h-full"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Editar informações do usuário"
              : "Criar um novo usuário"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitUser, handleInvalidForm)}
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

            {/* Senha */}
            <label htmlFor="password" className="col-span-1 font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              className="col-span-3"
              {...register("password")}
              placeholder={
                errors.password?.message ||
                (isEditing
                  ? "Deixe vazio para manter a atual"
                  : "Digite a senha")
              }
            />

            {/* Role */}
            <label htmlFor="role" className="col-span-1 font-medium">
              Cargo
            </label>
            <Select
              value={watch("role")}
              onValueChange={(value: "ADMIN" | "USER") =>
                setValue("role", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um cargo" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.role} value={role.role}>
                    {role.descricao}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (isEditing && user) {
                    reset({
                      name: user.name,
                      email: user.email,
                      role: user.role,
                      password: "",
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
              {isEditing ? "Salvar Alterações" : "Criar Usuário"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

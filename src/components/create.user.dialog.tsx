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
import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CreateUserInput, createUserSchema } from "@/schemas/users.schemas";
import { createUsuarioAction } from "@/app/actions/users.actions";
import { SuccessResponse } from "@/@types/response";

export function CreateUsuarioDialog() {
  const [open, setOpen] = useState(false);
  const roles = [
    {
      descricao: "Administrador",
      role: "ADMIN",
    },
    {
      descricao: "Usuario",
      role: "USER",
    },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  async function handleCreateUsuario(data: CreateUserInput) {
    try {
      const response: SuccessResponse = await createUsuarioAction(data);
      if (response.success) {
        toast.success(response.message);
        setOpen(false);
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

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(!open);
        reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="w-4 h-4 mr-2" />
          Novo Usuário
        </Button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={() => {
          reset();
        }}
        className="sm:max-w-md sm:max-h-[50vh] w-full h-full"
      >
        <DialogHeader>
          <DialogTitle>Novo Usuário</DialogTitle>
          <DialogDescription>Criar um novo Usuário</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleCreateUsuario, handleInvalidForm)}
          className="space-y- w-full h-full"
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
              placeholder={errors.name?.message}
            />

            {/* Email */}
            <label htmlFor="email" className="col-span-1 font-medium">
              Email
            </label>
            <Input
              id="email"
              className="col-span-3"
              {...register("email")}
              placeholder={errors.email?.message}
            />

            {/* password */}
            <label htmlFor="password" className="col-span-1 font-medium">
              Senha
            </label>
            <Input
              id="password"
              className="col-span-3"
              {...register("password")}
              placeholder={errors.password?.message}
            />

            {/* Role */}
            <label htmlFor="role" className="col-span-1 font-medium">
              Cargo
            </label>
            <Select
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
                  reset();
                }}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Criar Usuário</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

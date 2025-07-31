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
  CreatePartInput,
  createPartSchema,
  UpdatePartInput,
  updatePartSchema,
} from "@/schemas/parts.schemas";
import { createPartAction, updatePartAction } from "@/app/actions/part.actions";
import { Textarea } from "./ui/textarea";

interface Part {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description?: string;
}

interface PartDialogProps {
  mode?: "create" | "edit";
  part?: Part;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function PartDialog({
  mode = "create",
  part,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
}: PartDialogProps) {
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
  } = useForm<CreatePartInput | UpdatePartInput>({
    resolver: zodResolver(isEditing ? updatePartSchema : createPartSchema),
    defaultValues:
      isEditing && part
        ? {
            name: part.name,
            quantity: part.quantity,
            unitPrice: part.unitPrice,
            description: part.description,
          }
        : undefined,
  });

  useEffect(() => {
    if (isEditing && part) {
      setValue("name", part.name);
      setValue("quantity", part.quantity);
      setValue("unitPrice", part.unitPrice);
      setValue("description", part.description);
    }
  }, [part, isEditing, setValue]);

  async function handleSubmitPart(data: CreatePartInput | UpdatePartInput) {
    try {
      let response: SuccessResponse;

      if (isEditing && part?.id) {
        response = await updatePartAction(part.id, data as UpdatePartInput);
      } else {
        // Para modo de criação, usar o tipo CreatePartInput
        response = await createPartAction(data as CreatePartInput);
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
      if (isEditing && part) {
        reset({
          name: part.name,
          quantity: part.quantity,
          unitPrice: part.unitPrice,
          description: part.description,
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
          Nova Peça
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
          if (isEditing && part) {
            reset({
              name: part.name,
              quantity: part.quantity,
              unitPrice: part.unitPrice,
              description: part.description,
            });
          } else {
            reset();
          }
        }}
        className="sm:max-w-lg sm:max-h-[55vh] w-full h-full"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Peça" : "Nova Peça"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Editar informações da peça" : "Criar uma nova peça"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitPart, handleInvalidForm)}
          className="space-y-4 w-full h-full"
        >
          <div className="grid grid-cols-4 items-center text-right gap-3">
            {/* name */}
            <label htmlFor="name" className="col-span-1 font-medium">
              Peça
            </label>
            <Input
              id="name"
              className="col-span-3"
              {...register("name")}
              placeholder={errors.name?.message || "Digite o nomea da peça"}
            />

            {/* Descrição */}
            <label htmlFor="description" className="col-span-1 font-medium">
              Descrição
            </label>
            <Textarea
              id="description"
              className="col-span-3"
              {...register("description")}
            />

            {/* Preço */}
            <label htmlFor="unitPrice" className="col-span-1 font-medium">
              Preço Unitário
            </label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              min="0"
              className="col-span-3"
              {...register("unitPrice", { valueAsNumber: true })}
              placeholder={
                errors.unitPrice?.message || "Digite o valor unitário"
              }
            />

            {/* Estoque */}
            <label htmlFor="quantity" className="col-span-1 font-medium">
              Quantidade
            </label>
            <Input
              id="quantity"
              type="number"
              className="col-span-3"
              {...register("quantity", { valueAsNumber: true })}
              placeholder={
                errors.quantity?.message || "Digite a quantidade em estoque"
              }
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (isEditing && part) {
                    reset({
                      name: part.name,
                      quantity: part.quantity,
                      unitPrice: part.unitPrice,
                      description: part.description,
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
              {isEditing ? "Salvar Alterações" : "Criar Peça"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

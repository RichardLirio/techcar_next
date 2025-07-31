"use client";
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
import { PlusCircle, Edit, Plus, X, Trash2 } from "lucide-react";
import { SuccessResponse } from "@/@types/response";
import {
  CreateOrderInput,
  createOrderSchema,
  UpdateOrderInput,
  updateOrderSchema,
} from "@/schemas/order.schemas";
import {
  createOrderAction,
  updateOrderAction,
} from "@/app/actions/order.actions";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Vehicle } from "@/schemas/vehicles.schemas";
import { Part } from "@/schemas/parts.schemas";
import { FetchClientData } from "@/schemas/clients.schemas";

interface Service {
  description: string;
  price: number;
}

interface ServiceOrderItem {
  partId: string;
  quantity: number;
  unitPrice: number;
}

interface ServiceOrder {
  id: string;
  clientId: string;
  vehicleId: string;
  description: string;
  kilometers: number;
  discount: number;
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  services: Service[];
  items: ServiceOrderItem[];
}

interface ServiceOrderDialogProps {
  mode?: "create" | "edit";
  serviceOrder?: ServiceOrder;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  clients: FetchClientData[];
  vehicles: Vehicle[];
  parts: Part[];
}

export function ServiceOrderDialog({
  mode = "create",
  serviceOrder,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  clients,
  vehicles,
  parts,
}: ServiceOrderDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [items, setItems] = useState<ServiceOrderItem[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [newService, setNewService] = useState({ description: "", price: 0 });
  const [newItem, setNewItem] = useState({ partId: "", quantity: 1 });

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
  } = useForm<CreateOrderInput | UpdateOrderInput>({
    resolver: zodResolver(isEditing ? updateOrderSchema : createOrderSchema),
    defaultValues:
      isEditing && serviceOrder
        ? {
            clientId: serviceOrder.clientId,
            vehicleId: serviceOrder.vehicleId,
            description: serviceOrder.description,
            kilometers: serviceOrder.kilometers,
            discount: serviceOrder.discount,
            status: serviceOrder.status,
          }
        : undefined,
  });

  // Filtrar veículos baseado no cliente selecionado
  const availableVehicles = vehicles.filter(
    (vehicle) => vehicle.clientId === selectedClientId
  );

  useEffect(() => {
    if (isEditing && serviceOrder) {
      setValue("clientId", serviceOrder.clientId);
      setValue("vehicleId", serviceOrder.vehicleId);
      setValue("description", serviceOrder.description);
      setValue("kilometers", serviceOrder.kilometers);
      setValue("discount", serviceOrder.discount);
      setValue("status", serviceOrder.status);
      setSelectedClientId(serviceOrder.clientId);
      setServices(serviceOrder.services);
      setItems(serviceOrder.items);
    }
  }, [serviceOrder, isEditing, setValue]);

  function addService() {
    if (newService.description && newService.price > 0) {
      setServices([...services, newService]);
      setNewService({ description: "", price: 0 });
    } else {
      toast.error("Preencha a descrição e preço do serviço");
    }
  }

  function removeService(index: number) {
    setServices(services.filter((_, i) => i !== index));
  }

  function addItem() {
    if (newItem.partId && newItem.quantity > 0) {
      const part = parts.find((p) => p.id === newItem.partId);
      if (!part) {
        toast.error("Peça não encontrada");
        return;
      }

      if (newItem.quantity > part.quantity) {
        toast.error("Quantidade solicitada maior que o estoque disponível");
        return;
      }

      const existingItemIndex = items.findIndex(
        (item) => item.partId === newItem.partId
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        setItems(updatedItems);
      } else {
        setItems([
          ...items,
          {
            partId: newItem.partId,
            quantity: newItem.quantity,
            unitPrice: Number(part.unitPrice),
          },
        ]);
      }

      setNewItem({ partId: "", quantity: 1 });
    } else {
      toast.error("Selecione uma peça e quantidade válida");
    }
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItemQuantity(index: number, quantity: number) {
    if (quantity <= 0) return;

    const item = items[index];
    const part = parts.find((p) => p.id === item.partId);

    if (part && quantity > part.quantity) {
      toast.error("Quantidade maior que o estoque disponível");
      return;
    }

    const updatedItems = [...items];
    updatedItems[index].quantity = quantity;
    setItems(updatedItems);
  }

  async function handleSubmitServiceOrder(
    data: CreateOrderInput | UpdateOrderInput
  ) {
    if (services.length === 0) {
      toast.error("Adicione pelo menos um serviço");
      return;
    }

    try {
      let response: SuccessResponse;
      const submitData = {
        ...data,
        services,
        items,
      };

      if (isEditing && serviceOrder?.id) {
        response = await updateOrderAction(
          serviceOrder.id,
          submitData as UpdateOrderInput
        );
      } else {
        response = await createOrderAction(submitData as CreateOrderInput);
      }

      if (response.success) {
        setOpen(false);
        reset();
        setServices([]);
        setItems([]);
        setSelectedClientId("");
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
      if (isEditing && serviceOrder) {
        reset({
          clientId: serviceOrder.clientId,
          vehicleId: serviceOrder.vehicleId,
          description: serviceOrder.description,
          kilometers: serviceOrder.kilometers,
        });
        setSelectedClientId(serviceOrder.clientId);
        setServices(serviceOrder.services);
        setItems(serviceOrder.items);
      } else {
        reset();
        setServices([]);
        setItems([]);
        setSelectedClientId("");
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
          Nova Ordem de Serviço
        </>
      )}
    </Button>
  );

  const totalServices = services.reduce(
    (sum, service) => sum + Number(service.price),
    0
  );
  const totalItems = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.unitPrice),
    0
  );
  const totalOrder = totalServices + totalItems;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      )}

      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Editar informações da ordem de serviço"
              : "Criar uma nova ordem de serviço"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitServiceOrder, handleInvalidForm)}
          className="space-y-6"
        >
          {/* Dados básicos */}
          <div className="grid grid-cols-2 gap-4">
            {/* Cliente */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select
                value={selectedClientId}
                onValueChange={(value) => {
                  setSelectedClientId(value);
                  setValue("clientId", value);
                  setValue("vehicleId", ""); // Reset vehicle when client changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Veículo */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Veículo</label>
              <Select
                disabled={!selectedClientId}
                onValueChange={(value) => setValue("vehicleId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um veículo" />
                </SelectTrigger>
                <SelectContent>
                  {availableVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} - {vehicle.plate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quilometragem */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quilometragem</label>
              <Input
                type="number"
                {...register("kilometers", { valueAsNumber: true })}
                placeholder="Digite a quilometragem"
              />
            </div>
          </div>

          {/* Status - apenas no modo de edição */}
          {isEditing && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  onValueChange={(value) =>
                    setValue(
                      "status",
                      value as "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
                    )
                  }
                  defaultValue={serviceOrder?.status}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
                    <SelectItem value="COMPLETED">Concluído</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Descrição */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              {...register("description")}
              placeholder="Descrição da ordem de serviço"
            />
          </div>

          {/* Serviços */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Serviços</h3>

            {/* Adicionar novo serviço */}
            <div className="grid grid-cols-4 gap-2 items-end">
              <div className="col-span-2">
                <label className="text-sm font-medium">
                  Descrição do Serviço
                </label>
                <Input
                  value={newService.description}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      description: e.target.value,
                    })
                  }
                  placeholder="Ex: Troca de óleo"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Preço</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newService.price || ""}
                  onChange={(e) =>
                    setNewService({
                      ...newService,
                      price: Number(e.target.value),
                    })
                  }
                  placeholder="0.00"
                />
              </div>
              <Button type="button" onClick={addService}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de serviços */}
            {services.length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Serviços Adicionados</h4>
                <div className="space-y-2">
                  {services.map((service, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <span className="font-medium">
                          {service.description}
                        </span>
                        <span className="text-gray-500 ml-2">
                          R$ {Number(service.price).toFixed(2)}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Peças */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Peças</h3>

            {/* Adicionar nova peça */}
            <div className="grid grid-cols-4 gap-2 items-end">
              <div className="col-span-2">
                <label className="text-sm font-medium">Peça</label>
                <Select
                  value={newItem.partId}
                  onValueChange={(value) =>
                    setNewItem({ ...newItem, partId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma peça" />
                  </SelectTrigger>
                  <SelectContent>
                    {parts.map((part) => (
                      <SelectItem key={part.id} value={part.id}>
                        {part.name} - R$ {Number(part.unitPrice).toFixed(2)}{" "}
                        (Estoque: {part.quantity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Quantidade</label>
                <Input
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({ ...newItem, quantity: Number(e.target.value) })
                  }
                />
              </div>
              <Button type="button" onClick={addItem}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de peças */}
            {items.length > 0 && (
              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">Peças Adicionadas</h4>
                <div className="space-y-2">
                  {items.map((item, index) => {
                    const part = parts.find((p) => p.id === item.partId);
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 bg-gray-50 rounded"
                      >
                        <div className="flex-1">
                          <span className="font-medium">{part?.name}</span>
                          <span className="text-gray-500 ml-2">
                            R$ {Number(item.unitPrice).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItemQuantity(index, Number(e.target.value))
                            }
                            className="w-20"
                          />
                          <span className="text-sm text-gray-500">
                            = R$ {(item.quantity * item.unitPrice).toFixed(2)}
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Resumo dos totais */}
          {(services.length > 0 || items.length > 0) && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium mb-2">Resumo</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Serviços:</span>
                  <span>R$ {totalServices.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Peças:</span>
                  <span>R$ {totalItems.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-base border-t pt-1">
                  <span>Total Geral:</span>
                  <span>R$ {totalOrder.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              {isEditing ? "Salvar Alterações" : "Criar Ordem de Serviço"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

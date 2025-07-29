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
import { PlusCircle, Edit, Search, Check, ChevronsUpDown } from "lucide-react";
import { SuccessResponse } from "@/@types/response";
import {
  CreateVehicleInput,
  createVehicleSchema,
  UpdateVehicleInput,
  updateVehicleSchema,
} from "@/schemas/vehicles.schemas";
import { Vehicle } from "@/schemas/vehicles.schemas";
import {
  createVehicleAction,
  updateVehicleAction,
} from "@/app/actions/vehicles.actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { FetchClientData } from "@/schemas/clients.schemas";

interface VehicleDialogProps {
  mode?: "create" | "edit";
  vehicle?: Vehicle;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  // Função para buscar clientes - você deve implementar isso
  onSearchClients?: (searchTerm: string) => Promise<FetchClientData[]>;
  // Lista inicial de clientes (opcional)
  clients?: FetchClientData[];
}

export function VehicleDialog({
  mode = "create",
  vehicle,
  trigger,
  open: controlledOpen,
  onOpenChange,
  onSuccess,
  onSearchClients,
  clients = [],
}: VehicleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [clientSearchOpen, setClientSearchOpen] = useState(false);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [searchResults, setSearchResults] =
    useState<FetchClientData[]>(clients);
  const [selectedClient, setSelectedClient] = useState<FetchClientData | null>(
    null
  );
  const [isSearching, setIsSearching] = useState(false);

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
  } = useForm<CreateVehicleInput | UpdateVehicleInput>({
    resolver: zodResolver(
      isEditing ? updateVehicleSchema : createVehicleSchema
    ),
    defaultValues:
      isEditing && vehicle
        ? {
            plate: vehicle.plate,
            model: vehicle.model,
            brand: vehicle.brand,
            kilometers: vehicle.kilometers,
            year: vehicle.year ? vehicle.year : 0,
            clientId: vehicle.clientId,
          }
        : undefined,
  });

  // Buscar cliente atual quando estiver editando
  useEffect(() => {
    if (isEditing && vehicle && vehicle.clientId) {
      // Procurar o cliente na lista de clientes ou fazer uma busca
      const currentClient = searchResults.find(
        (c) => c.id === vehicle.clientId
      );
      if (currentClient) {
        setSelectedClient(currentClient);
      }
      // Se não encontrar na lista atual, você pode fazer uma busca específica aqui
    }
  }, [vehicle, isEditing, searchResults]);

  // Atualiza os valores do formulário quando o vehicle muda (modo edição)
  useEffect(() => {
    if (isEditing && vehicle) {
      setValue("plate", vehicle.plate);
      setValue("model", vehicle.model);
      setValue("brand", vehicle.brand);
      setValue("kilometers", vehicle.kilometers);
      setValue("year", vehicle.year ? vehicle.year : 0);
      setValue("clientId", vehicle.clientId);
    }
  }, [vehicle, isEditing, setValue]);

  // Buscar clientes quando o termo de busca mudar
  useEffect(() => {
    const searchClients = async () => {
      if (onSearchClients && clientSearchTerm.length > 0) {
        setIsSearching(true);
        try {
          const results = await onSearchClients(clientSearchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error("Erro ao buscar clientes:", error);
          toast.error("Erro ao buscar clientes");
        } finally {
          setIsSearching(false);
        }
      } else if (clientSearchTerm.length === 0) {
        setSearchResults(clients);
      }
    };

    const debounceTimer = setTimeout(searchClients, 300);
    return () => clearTimeout(debounceTimer);
  }, [clientSearchTerm, onSearchClients, clients]);

  async function handleSubmitVehicle(
    data: CreateVehicleInput | UpdateVehicleInput
  ) {
    // Verificar se um cliente foi selecionado
    if (!selectedClient) {
      toast.error("Por favor, selecione um cliente");
      return;
    }

    try {
      let response: SuccessResponse;

      // Adicionar o clientId aos dados
      const vehicleData = {
        ...data,
        clientId: selectedClient.id,
      };

      if (isEditing && vehicle?.id) {
        response = await updateVehicleAction(
          vehicle.id,
          vehicleData as UpdateVehicleInput
        );
      } else {
        response = await createVehicleAction(vehicleData as CreateVehicleInput);
      }

      if (response.success) {
        setOpen(false);
        reset();
        setSelectedClient(null);
        setClientSearchTerm("");
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
      if (isEditing && vehicle) {
        reset({
          plate: vehicle.plate,
          model: vehicle.model,
          brand: vehicle.brand,
          kilometers: vehicle.kilometers,
          year: vehicle.year ? vehicle.year : 0,
          clientId: vehicle.clientId,
        });
      } else {
        reset();
        setSelectedClient(null);
        setClientSearchTerm("");
      }
    } else {
      // Limpar estado quando fechar
      setClientSearchOpen(false);
      setClientSearchTerm("");
      if (!isEditing) {
        setSelectedClient(null);
      }
    }
  }

  function handleClientSelect(client: FetchClientData) {
    setSelectedClient(client);
    setClientSearchOpen(false);
    setValue("clientId", client.id);
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
          Novo Veículo
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
          if (isEditing && vehicle) {
            reset({
              plate: vehicle.plate,
              model: vehicle.model,
              brand: vehicle.brand,
              kilometers: vehicle.kilometers,
              year: vehicle.year ? vehicle.year : 0,
              clientId: vehicle.clientId,
            });
          } else {
            reset();
          }
        }}
        className="sm:max-w-lg sm:max-h-[70vh] w-full h-full"
      >
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Veículo" : "Novo Veículo"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Editar informações do veículo"
              : "Criar um novo veículo"}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleSubmitVehicle, handleInvalidForm)}
          className="space-y-4 w-full h-full"
        >
          <div className="grid grid-cols-4 items-center text-right gap-3">
            {/* Cliente */}
            <label htmlFor="client" className="col-span-1 font-medium">
              Cliente *
            </label>
            <div className="col-span-3">
              <Popover
                open={clientSearchOpen}
                onOpenChange={setClientSearchOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clientSearchOpen}
                    className="w-full justify-between"
                  >
                    {selectedClient
                      ? selectedClient.name
                      : "Selecione um cliente..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Buscar cliente..."
                      value={clientSearchTerm}
                      onValueChange={setClientSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {isSearching
                          ? "Buscando clientes..."
                          : clientSearchTerm.length > 0
                          ? "Nenhum cliente encontrado."
                          : "Digite para buscar clientes"}
                      </CommandEmpty>
                      <CommandGroup>
                        {searchResults.map((client) => (
                          <CommandItem
                            key={client.id}
                            value={client.name}
                            onSelect={() => handleClientSelect(client)}
                          >
                            <Check
                              className={`mr-2 h-4 w-4 ${
                                selectedClient?.id === client.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                            <div className="flex flex-col">
                              <span>{client.name}</span>
                              {client.cpfCnpj && (
                                <span className="text-sm text-muted-foreground">
                                  {client.cpfCnpj}
                                </span>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {!selectedClient && (
                <p className="text-sm text-red-500 mt-1">
                  Selecione um cliente para continuar
                </p>
              )}
            </div>

            {/* Placa */}
            <label htmlFor="plate" className="col-span-1 font-medium">
              Placa
            </label>
            <Input
              id="plate"
              className="col-span-3"
              {...register("plate")}
              placeholder={errors.plate?.message || "Digite a placa"}
            />

            {/* Modelo */}
            <label htmlFor="model" className="col-span-1 font-medium">
              Modelo
            </label>
            <Input
              id="model"
              type="text"
              className="col-span-3"
              {...register("model")}
              placeholder={errors.model?.message || "Digite o modelo"}
            />

            {/* Marca */}
            <label htmlFor="brand" className="col-span-1 font-medium">
              Marca
            </label>
            <Input
              id="brand"
              type="text"
              className="col-span-3"
              {...register("brand")}
              placeholder={errors.brand?.message || "Digite a marca"}
            />

            {/* KM */}
            <label htmlFor="kilometers" className="col-span-1 font-medium">
              KM
            </label>
            <Input
              id="kilometers"
              type="number"
              className="col-span-3"
              {...register("kilometers", { valueAsNumber: true })}
              placeholder={
                errors.kilometers?.message || "Digite a quilometragem"
              }
            />

            {/* ANO */}
            <label htmlFor="year" className="col-span-1 font-medium">
              Ano
            </label>
            <Input
              id="year"
              type="number"
              className="col-span-3"
              {...register("year", { valueAsNumber: true })}
              placeholder={
                errors.year?.message || "Digite o ano (Não obrigatório)"
              }
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (isEditing && vehicle) {
                    reset({
                      plate: vehicle.plate,
                      model: vehicle.model,
                      brand: vehicle.brand,
                      kilometers: vehicle.kilometers,
                      year: vehicle.year ? vehicle.year : 0,
                      clientId: vehicle.clientId,
                    });
                  } else {
                    reset();
                    setSelectedClient(null);
                    setClientSearchTerm("");
                  }
                }}
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!selectedClient}>
              {isEditing ? "Salvar Alterações" : "Criar Veículo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

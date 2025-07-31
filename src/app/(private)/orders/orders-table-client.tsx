"use client";

import { DataTable } from "./data-table";
import { createColumns } from "./columns";
import { FetchOrderData } from "@/schemas/order.schemas";
import { FetchClientData } from "@/schemas/clients.schemas";
import { Vehicle } from "@/schemas/vehicles.schemas";
import { Part } from "@/schemas/parts.schemas";

interface OrdersTableClientProps {
  data: FetchOrderData[];
  clients: FetchClientData[];
  vehicles: Vehicle[];
  parts: Part[];
}

export function OrdersTableClient({
  data,
  clients,
  vehicles,
  parts,
}: OrdersTableClientProps) {
  const columns = createColumns(clients, vehicles, parts);

  return (
    <DataTable<FetchOrderData, any>
      columns={columns}
      data={data}
      clients={clients}
      vehicles={vehicles}
      parts={parts}
    />
  );
}

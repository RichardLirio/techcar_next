import { getDataVehicles } from "@/app/actions/vehicles.actions";
import { DataTable } from "./data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { columns } from "./columns";
import { getDataClients } from "@/app/actions/clients.actions";

export default async function VehiclesPage() {
  const data = await getDataVehicles();
  const clients = await getDataClients();
  return (
    <div className="flex flex-1 flex-col p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Veículos</CardTitle>
          <CardDescription>Gerencie os veículos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data ? data : []}
            clients={clients}
          />
        </CardContent>
      </Card>
    </div>
  );
}

import { OrdersTableClient } from "./orders-table-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { getDataOrders } from "@/app/actions/order.actions";
import { getDataClients } from "@/app/actions/clients.actions";
import { getDataVehicles } from "@/app/actions/vehicles.actions";
import { getDataParts } from "@/app/actions/part.actions";

export default async function VehiclesPage() {
  const orders = await getDataOrders();
  const clients = await getDataClients();
  const vehicles = await getDataVehicles();
  const parts = await getDataParts();

  return (
    <div className="flex flex-1 flex-col p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Ordens de Serviço</CardTitle>
          <CardDescription>
            Gerencie as ordens de serviço cadastradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTableClient
            data={orders ? orders : []}
            clients={clients ? clients : []}
            vehicles={vehicles ? vehicles : []}
            parts={parts ? parts : []}
          />
        </CardContent>
      </Card>
    </div>
  );
}

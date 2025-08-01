import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import DashboardPage from "./dashboard";
import { getDataOrders } from "@/app/actions/order.actions";
import { getDataClients } from "@/app/actions/clients.actions";
import { getDataVehicles } from "@/app/actions/vehicles.actions";
import { getDataParts } from "@/app/actions/part.actions";

export default async function Dashboard() {
  const orders = await getDataOrders();
  const clients = await getDataClients();
  const vehicles = await getDataVehicles();
  const parts = await getDataParts();
  return (
    <div className="flex flex-1 flex-col p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Dashboard</CardTitle>
          <CardDescription>
            Visão geral do seu sistema de gestão automotiva
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardPage
            orders={orders ? orders : []}
            clients={clients ? clients : []}
            vehicles={vehicles ? vehicles : []}
            parts={parts ? parts : []}
          />
        </CardContent>
      </Card>
    </div>
  );
}

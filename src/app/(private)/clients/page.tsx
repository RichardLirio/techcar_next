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

export default async function ClientsPage() {
  const data = await getDataClients();
  return (
    <div className="flex flex-1 flex-col p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Clientes</CardTitle>
          <CardDescription>Gerencie os clientes cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data ? data : []} />
        </CardContent>
      </Card>
    </div>
  );
}

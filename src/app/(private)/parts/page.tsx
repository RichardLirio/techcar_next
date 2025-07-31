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
import { getDataParts } from "@/app/actions/part.actions";

export default async function VehiclesPage() {
  const data = await getDataParts();
  return (
    <div className="flex flex-1 flex-col p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Peças</CardTitle>
          <CardDescription>Gerencie as peças cadastradas</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data ? data : []} />
        </CardContent>
      </Card>
    </div>
  );
}

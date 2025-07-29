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
import { getUsersData } from "@/app/actions/users.actions";

export default async function Usuarios() {
  const data = await getUsersData();
  return (
    <div className="flex flex-1 flex-col p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Usuários</CardTitle>
          <CardDescription>Gerencie os usuários cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={data ? data : []} />
        </CardContent>
      </Card>
    </div>
  );
}

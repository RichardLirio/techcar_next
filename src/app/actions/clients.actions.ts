"use server";

import { revalidateTag } from "next/cache";
import { api } from "@/data/api";
import { cookies } from "next/headers";
import { CreateClientData } from "@/schemas/clients.schemas";

export async function createClienteAction(data: CreateClientData) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("clients", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const cliente = await response.json();

  if (!response.ok) throw new Error(cliente.message);

  revalidateTag("clients");

  return cliente.cliente;
}

export async function deleteClienteAction(cpfCnpj: string) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`clients/${cpfCnpj}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const cliente = await response.json();
    if (response.status === 400) {
      throw new Error(cliente.message);
    }

    throw new Error(cliente.message);
  }

  if (response.status === 204) {
    revalidateTag("clients");
    return;
  }

  return;
}

// export async function getDataClientes(): Promise<FetchClienteSchema[]> {
//   const cookieStore = await cookies();
//   const refreshToken = cookieStore.get("refreshToken")?.value;

//   const data = await api("clients", {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${refreshToken}`,
//     },
//     credentials: "include",
//     next: {
//       tags: ["clients"], // Tag for cache invalidation
//     },
//   });
//   const clientes: { clientes: FetchClienteSchema[] } = await data.json();

//   return clientes.clientes;
//}

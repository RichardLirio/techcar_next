"use server";

import { revalidateTag } from "next/cache";
import { api } from "@/data/api";
import { cookies } from "next/headers";
import {
  CreateClientInput,
  FetchClientData,
  UpdateClientInput,
} from "@/schemas/clients.schemas";
import { SuccessResponse } from "@/@types/response";

export async function createClienteAction(data: CreateClientInput) {
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

  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.message);

  revalidateTag("clients");

  return responseData;
}

export async function deleteClienteAction(id: string) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`clients/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
  });

  if (response.status === 204) {
    revalidateTag("clients");
    return;
  }
  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.message);

  return;
}

export async function getDataClients() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("clients", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
    next: {
      tags: ["clients"], // Tag for cache invalidation
    },
  });
  const responseData: SuccessResponse<{ clients: FetchClientData[] }> =
    await response.json();
  if (!response.ok) throw new Error(responseData.message);

  if (responseData.success && responseData.data) {
    return responseData.data.clients;
  }
}

export async function updateClientAction(id: string, data: UpdateClientInput) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`clients/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.message);

  revalidateTag("clients");

  return responseData;
}

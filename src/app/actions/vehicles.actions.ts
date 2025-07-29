"use server";

import { revalidateTag } from "next/cache";
import { api } from "@/data/api";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessResponse } from "@/@types/response";
import {
  CreateVehicleInput,
  FetchVehicleData,
  UpdateVehicleInput,
} from "@/schemas/vehicles.schemas";

function isSuccessResponse<T>(
  response: SuccessResponse<T> | ErrorResponse
): response is SuccessResponse<T> {
  return response.success === true;
}

export async function createVehicleAction(data: CreateVehicleInput) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("vehicles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.error);

  revalidateTag("vehicles");

  return responseData;
}

export async function deleteVehicleAction(id: string) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`vehicles/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
  });

  if (response.status === 204) {
    revalidateTag("vehicles");
    return;
  }
  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.error);

  return;
}

export async function getDataVehicles() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("vehicles", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
    next: {
      tags: ["vehicles"], // Tag for cache invalidation
    },
  });
  const responseData:
    | SuccessResponse<{ vehicles: FetchVehicleData[] }>
    | ErrorResponse = await response.json();

  if (isSuccessResponse(responseData)) {
    return responseData.data?.vehicles;
  } else {
    throw new Error(responseData.error.toString());
  }
}

export async function updateVehicleAction(
  id: string,
  data: UpdateVehicleInput
) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.error);

  revalidateTag("vehicles");

  return responseData;
}

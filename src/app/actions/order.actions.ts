"use server";

import { revalidateTag } from "next/cache";
import { api } from "@/data/api";
import { cookies } from "next/headers";
import { ErrorResponse, SuccessResponse } from "@/@types/response";
import {
  CreateOrderInput,
  FetchOrderData,
  UpdateOrderInput,
} from "@/schemas/order.schemas";

function isSuccessResponse<T>(
  response: SuccessResponse<T> | ErrorResponse
): response is SuccessResponse<T> {
  return response.success === true;
}

export async function createOrderAction(data: CreateOrderInput) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("orders", {
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

  revalidateTag("orders");

  return responseData;
}

export async function deleteOrderAction(id: string) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`orders/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
  });

  if (response.status === 204) {
    revalidateTag("orders");
    return;
  }
  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.error);

  return;
}

export async function getDataOrders() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("orders", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
    next: {
      tags: ["orders"], // Tag for cache invalidation
    },
  });
  const responseData:
    | SuccessResponse<{ orders: FetchOrderData[] }>
    | ErrorResponse = await response.json();

  if (isSuccessResponse(responseData)) {
    return responseData.data?.orders;
  } else {
    throw new Error(responseData.error.toString());
  }
}

export async function updateOrderAction(id: string, data: UpdateOrderInput) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`orders/${id}`, {
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

  revalidateTag("orders");

  return responseData;
}

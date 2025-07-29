"use server";

import { revalidateTag } from "next/cache";
import { api } from "@/data/api";
import { cookies } from "next/headers";
import {
  CreateUserInput,
  FetchUserData,
  UpdateUserInput,
} from "@/schemas/users.schemas";
import { SuccessResponse } from "@/@types/response";

export async function createUsuarioAction(data: CreateUserInput) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("users", {
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

  revalidateTag("users");

  return responseData;
}

export async function deleteUsuarioAction(userId: string) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`users/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
  });
  if (response.status === 204) {
    revalidateTag("users");
    return;
  }
  const responseData = await response.json();

  if (!response.ok) throw new Error(responseData.message);

  return;
}

export async function getUsersData() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api("users", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
    credentials: "include",
    next: {
      tags: ["users"],
    },
  });

  const responseData: SuccessResponse<{ users: FetchUserData[] }> =
    await response.json();
  if (!response.ok) throw new Error(responseData.message);

  if (responseData.success && responseData.data) {
    return responseData.data.users;
  }
}

export async function updateUsuarioAction(id: string, data: UpdateUserInput) {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const response = await api(`users/${id}`, {
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

  revalidateTag("users");

  return responseData;
}

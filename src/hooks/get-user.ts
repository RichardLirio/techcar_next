import { api } from "@/data/api";
import { ProfileLogin } from "@/schemas/userProfile-schema";
import { cookies } from "next/headers";

// Tipo para resposta de sucesso
export interface SuccessResponseProfile {
  success: true;
  message: string;
  data: { user: ProfileLogin };
}

export async function getUser() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const response = await api("profile", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const userReponse: SuccessResponseProfile = await response.json();
  return userReponse.data.user;
}

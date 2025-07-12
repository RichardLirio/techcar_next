"use client";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NaoAutorizado() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <div className="flex items-center justify-center mb-4">
          <AlertTriangle className="text-red-500 w-10 h-10" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Acesso negado
        </h1>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <Button onClick={() => (window.location.href = "/")}>
          Voltar para o início
        </Button>
      </div>
    </div>
  );
}

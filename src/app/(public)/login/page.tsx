import { LoginForm } from "@/components/login-form";
import { Car } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a className="flex items-center gap-2 self-center font-semibold">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Car className="size-4" />
          </div>
          Farol Web
        </a>
        <LoginForm />
      </div>
    </div>
  );
}

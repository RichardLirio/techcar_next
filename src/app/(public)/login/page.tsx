import { LoginForm } from "@/components/login-form";
import { Car } from "lucide-react";
import image1 from "./login.png";

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-semibold">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Car className="size-5" />
            </div>
            TechCar
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-96">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={image1.src}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { Car, CarIcon, LayoutDashboardIcon, Users, Wrench } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { Separator } from "@/components/ui/separator";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();

  const userState = React.useMemo(() => {
    if (!user) {
      return {
        name: "Usuário",
        email: "email@exemplo.com",
        avatar: "??",
      };
    }

    const initials = user.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return {
      name: user.name,
      email: user.email,
      avatar: initials,
      cargo: user.role,
    };
  }, [user]);

  const data = {
    userState,
    navMain: [
      { title: "Dashboard", url: "/", icon: LayoutDashboardIcon },
      { title: "Clientes", url: "/clients", icon: Users },
      { title: "Veículos", url: "/vehicles", icon: CarIcon },
    ],
    navSecondary: [{ title: "Usuários", url: "/admin/usuarios", icon: Wrench }],
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader title="rew">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/">
                <div className="bg-primary text-primary-foreground rounded">
                  <Car className="h-5 w-6" />
                </div>
                <span className="text-base font-semibold">TechCar</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <Separator
          orientation="horizontal"
          className="mx-auto data-[orientation=horizontal]"
        />
        {userState.cargo === "ADMIN" && (
          <div>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <NavMain items={data.navSecondary} />
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.userState} />
      </SidebarFooter>
    </Sidebar>
  );
}

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUser } from "@/hooks/get-user";
import { AuthProvider } from "@/context/AuthContext";

async function StoreLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  return (
    <SidebarProvider>
      <AuthProvider user={user}>
        <AppSidebar variant="inset" />
      </AuthProvider>
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default StoreLayout;

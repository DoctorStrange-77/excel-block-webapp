import { Home, Users, FileText, TrendingUp, Dumbbell, Target, Apple, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { path: "/home", label: "Home", icon: Home },
  { path: "/atleti", label: "Atleti", icon: Users },
  { path: "/schede", label: "Schede", icon: FileText },
  { path: "/progressioni", label: "Progressioni", icon: TrendingUp },
  { path: "/esercizi", label: "Esercizi", icon: Dumbbell },
  { path: "/distretti", label: "Distretti", icon: Target },
  { path: "/dieta", label: "Dieta", icon: Apple },
];

export function AppSidebar() {
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-card">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {open ? "Menu Principale" : <Menu className="h-4 w-4" />}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "text-foreground hover:bg-muted/50 hover:text-foreground"
                        }
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

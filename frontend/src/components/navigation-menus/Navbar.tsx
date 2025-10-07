import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  Menu,
  MessageSquare,
  Plus,
  Settings,
  Users,
  Image,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const menuItems = [
    {
      label: "Home",
      icon: Home,
      href: "/",
    },
    {
      label: "Image",
      icon: Image,
      href: "/image",
    },
  ];

  return (
    // add fixed  to the nav class name to make the navbar stick to the bottom of the screen
    <div className="fixed top-6 left-0 right-0 flex justify-center z-10">
      <nav className="flex items-center justify-center space-x-4 rounded-full border bg-background p-2 shadow-lg">
        {menuItems.map((item) => (
          <Link
            to={item.href}
            key={item.label}
            className={cn(
              "flex items-center justify-center space-x-4 rounded-full border bg-background p-2 shadow-lg transition-all duration-300 ease-in-out hover:bg-primary/50 hover:text-primary-foreground",
              pathname === item.href && "bg-primary text-primary-foreground hover:bg-primary"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
        {/* Dropdown Example
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              className="rounded-full bg-primary text-primary-foreground"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">Add</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              New Team
            </DropdownMenuItem>
            <DropdownMenuItem>
              <MessageSquare className="mr-2 h-4 w-4" />
              New Chat
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </nav>
    </div>
  );
}

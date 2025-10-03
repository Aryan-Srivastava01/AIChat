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
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    // add fixed  to the nav class name to make the navbar stick to the bottom of the screen
    <div className="fixed top-6 left-0 right-0 flex justify-center z-10">
      <nav className="flex items-center justify-center space-x-4 rounded-full border bg-background p-2 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => navigate("/")}
          title="Home"
        >
          <Home className="h-5 w-5" />
          <span className="sr-only">Home</span>
        </Button>
        {/* <Button variant="ghost" size="icon" className="rounded-full">
          <Users className="h-5 w-5" />
          <span className="sr-only">Users</span>
        </Button> */}
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
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          title="Image"
          onClick={() => navigate("/image")}
        >
          <Image className="h-5 w-5" />
          <span className="sr-only">Image</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          title="Menu"
          onClick={() => navigate("/menu")}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </nav>
    </div>
  );
}

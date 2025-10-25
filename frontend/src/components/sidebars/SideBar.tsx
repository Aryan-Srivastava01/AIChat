"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Blocks,
  CodeIcon,
  ChevronsUpDown,
  FileClock,
  GraduationCap,
  Layout,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  MessagesSquare,
  Plus,
  Settings,
  UserCircle,
  UserCog,
  UserSearch,
  House,
  Image,
  DollarSign,
  Code,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useClerk, UserButton, useUser } from "@clerk/clerk-react";
import { AnimatedThemeToggler } from "@/components/theme-togglers/AnimatedThemeToggler";
import { useTheme } from "@/hooks/useTheme";

const sidebarVariants = {
  open: {
    width: "15rem",
  },
  closed: {
    width: "3.05rem",
  },
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: {
      x: { stiffness: 100 },
    },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export function SideBar({ className }: { className?: string }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const theme = useTheme((state) => state.theme);
  const pathname = location.pathname;
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const userName = user?.fullName;
  const userEmail = user?.emailAddresses[0].emailAddress;
  const navigate = useNavigate();
  const clerk = useClerk();

  const menuItems = isSignedIn
    ? [
        { label: "Home", href: "/", icon: <House className="h-4 w-4" /> },
        { label: "Image", href: "/image", icon: <Image className="h-4 w-4" /> },
        {
          label: "Pricing",
          href: "/pricing",
          icon: <DollarSign className="h-4 w-4" />,
        },
        // { label: "App Builder", href: "/app-builder" },
        {
          label: "App Builder",
          href: "/app-builder-v2",
          icon: <Code className="h-4 w-4" />,
        },
      ]
    : [{ label: "Home", href: "/", icon: <House className="h-4 w-4" /> }];

  const handleNavigate = (href: string) => {
    if (isSignedIn) {
      navigate(href);
    } else {
      clerk.openSignIn();
    }
  };

  return (
    <motion.div
      className={cn(
        "sidebar left-0 top-0 z-40 h-full shrink-0 border-r fixed bg-sidebar",
        className
      )}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps as any}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-sidebar transition-all`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            {/* Logo and navigate to home */}
            <div className="flex h-[54px] w-full shrink-0  border-b p-2">
              <div className=" mt-[1.5px] flex w-full">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className="w-full" asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex w-fit items-center gap-2 px-2 cursor-pointer"
                      onClick={() => navigate("/")}
                    >
                      <Avatar className="rounded size-4">
                        <AvatarFallback>
                          <img
                            src="/favicon.png"
                            alt="AA chat"
                            className="size-4 rounded-full"
                          />
                        </AvatarFallback>
                      </Avatar>
                      <motion.li
                        variants={variants}
                        className="flex w-fit items-center gap-2"
                      >
                        {!isCollapsed && (
                          <>
                            <p className="text-sm font-medium  ">{"AA chat"}</p>
                            {/* <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" /> */}
                          </>
                        )}
                      </motion.li>
                    </Button>
                  </DropdownMenuTrigger>
                  {/* <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link to="/settings/members">
                        <UserCog className="h-4 w-4" /> Manage members
                      </Link>
                    </DropdownMenuItem>{" "}
                    <DropdownMenuItem
                      asChild
                      className="flex items-center gap-2"
                    >
                      <Link to="/settings/integrations">
                        <Blocks className="h-4 w-4" /> Integrations
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        to="/select-org"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Create or join an organization
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent> */}
                </DropdownMenu>
              </div>
            </div>

            {/* Sidebar menu items */}
            <div className=" flex h-full w-full flex-col">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow p-2">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {menuItems.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/" && pathname.startsWith(item.href));
                      return (
                        <span
                          onClick={() => handleNavigate(item.href)}
                          className={cn(
                            "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5   transition hover:bg-muted hover:text-primary cursor-pointer",
                            isActive && "bg-muted text-primary"
                          )}
                          key={item.label}
                        >
                          {item.icon}
                          <motion.li variants={variants}>
                            {!isCollapsed && (
                              <p className="ml-2 text-sm font-medium">
                                {item.label}
                              </p>
                            )}
                          </motion.li>
                        </span>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col p-2">
                <Separator className="w-full" />
                <span className="mt-auto flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-muted hover:text-primary">
                  <AnimatedThemeToggler barType="sidebar" className="w-4 h-4" />
                  <motion.li variants={variants}>
                    {!isCollapsed && (
                      <p className="ml-2 text-sm font-medium">
                        {"Switch Theme"}
                      </p>
                    )}
                  </motion.li>
                </span>
                {isSignedIn && (
                  <div>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger className="w-full">
                        <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5  transition hover:bg-muted hover:text-primary">
                          <Avatar className="size-4">
                            <UserButton />
                          </Avatar>
                          <motion.li
                            variants={variants}
                            className="flex w-full items-center gap-2"
                          >
                            {!isCollapsed && (
                              <>
                                <p className="text-sm font-medium">
                                  {userName}
                                </p>
                                {/* <ChevronsUpDown className="ml-auto h-4 w-4 text-muted-foreground/50" /> */}
                              </>
                            )}
                          </motion.li>
                        </div>
                      </DropdownMenuTrigger>
                      {/* <DropdownMenuContent sideOffset={5}>
                        <div className="flex flex-row items-center gap-2 p-2">
                          <Avatar className="size-6">
                            <AvatarFallback>AL</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col text-left">
                            <span className="text-sm font-medium">
                              {userName}
                            </span>
                            <span className="line-clamp-1 text-xs text-muted-foreground">
                              {userEmail}
                            </span>
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          asChild
                          className="flex items-center gap-2"
                        >
                          <Link to="/settings/profile">
                            <UserCircle className="h-4 w-4" /> Profile
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2">
                          <LogOut className="h-4 w-4" /> Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent> */}
                    </DropdownMenu>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}

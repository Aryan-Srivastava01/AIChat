"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Home, Image } from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavItem {
  id: number;
  icon: React.ReactNode;
  label: string;
  href: string;
}

const items: NavItem[] = [
  { id: 0, icon: <Home size={24} />, label: "Home", href: "/" },
  { id: 1, icon: <Image size={24} />, label: "Image", href: "/image" },
  // { id: 2, icon: <Search size={24} />, label: "Search", href: "/search" },
  // { id: 3, icon: <Bell size={24} />, label: "Alerts", href: "/alerts" },
  // { id: 4, icon: <User size={24} />, label: "Profile", href: "/profile" },
  // { id: 5, icon: <Bookmark size={24} />, label: "Saved", href: "/saved" },
  // { id: 5, icon: <Settings size={24} />, label: "Settings", href: "/settings" },
];

const LumaBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const [active, setActive] = useState(
    items.findIndex((item) => item.href === pathname)
  );

  return (
    <div className="fixed top-1 left-1/2 -translate-x-1/2 z-50">
      <div className="relative flex items-center justify-center gap-6 bg-background/20 backdrop-blur-2xl rounded-full px-6 py-3 shadow-xl border border-border">
        {/* Active Indicator Glow */}
        {/* <motion.div
          layoutId="active-indicator"
          className="absolute w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full blur-2xl -z-10"
          animate={{
            left: `calc(${active * (100 / items.length)}% + ${
              100 / items.length / 2
            }%)`,
            translateX: "-50%",
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        /> */}

        {items.map((item, index) => {
          const isActive = index === active && item.href === pathname;
          return (
            <motion.div
              key={item.id}
              className="relative flex flex-col items-center group"
            >
              {/* Animated active background (shared by layoutId) */}
              {/* {isActive && (
                <motion.div
                  layoutId="active-bg"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-primary/10 z-0 pointer-events-none"
                />
              )} */}

              {/* Button */}
              <motion.button
                onClick={() => {
                  setActive(index);
                  navigate(item.href);
                }}
                whileHover={{ scale: isActive ? 1.6 : 1.2 }}
                animate={{ scale: isActive ? 1.4 : 1 }}
                className={cn(
                  "flex items-center rounded-full justify-center w-14 h-14 text-muted-foreground relative z-10 cursor-pointer overflow-hidden",
                  isActive && "text-primary bg-primary/10"
                )}
              >
                {item.icon}
              </motion.button>

              {/* Tooltip */}
              <span className="absolute top-full mb-2 px-2 py-1 text-xs rounded-md bg-popover text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LumaBar;

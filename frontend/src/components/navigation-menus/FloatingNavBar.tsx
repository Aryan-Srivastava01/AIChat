import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  useClerk,
  useAuth,
  SignedIn,
  UserButton,
  SignedOut,
  SignOutButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "@/components/theme-togglers/AnimatedThemeToggler";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const FloatingNavBar = () => {
  const clerk = useClerk();
  const { isSignedIn } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const toggleMenu = () => setIsOpen(!isOpen);
  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Image", href: "/image" },
    { label: "Pricing", href: "/pricing" },
    // { label: "App Builder", href: "/app-builder" },
    { label: "App Builder", href: "/app-builder-v2" },
  ];

  const handleNavigate = (href: string) => {
    if (isSignedIn) {
      navigate(href);
    } else {
      clerk.openSignIn();
    }
  };

  const handleMobileNavigate = (href: string) => {
    if (isSignedIn) {
      toggleMenu();
      navigate(href);
    } else {
      toggleMenu();
      clerk.openSignIn();
    }
  };

  return (
    <div className="flex justify-center w-full py-6 px-2 sm:px-0 max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl">
      <div className="flex items-center justify-between px-6 py-3 bg-popover text-muted-foreground rounded-full shadow-lg w-full relative z-10">
        <div className="flex items-center">
          <motion.div
            className="w-8 h-8 mr-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 10 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="/favicon.png"
              alt="logo"
              width={32}
              height={32}
              className="rounded-full"
            />
          </motion.div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => {
            const isActive = item.href === pathname;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                <span
                  onClick={() => handleNavigate(item.href)}
                  className={cn(
                    "text-sm text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer",
                    isActive &&
                      "text-primary scale-150 bg-primary/10 rounded-full px-4 py-2 hover:bg-primary/20 hover:text-primary transition-all duration-300 ease-in-out"
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </nav>

        {/* Desktop Profile and Theme Toggler */}
        <motion.div
          className="hidden md:flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
        >
          <AnimatedThemeToggler barType="navbar" />
          <SignedOut>
            <Button
              className="cursor-pointer"
              onClick={() => clerk.openSignIn()}
            >
              Sign in
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
            <SignOutButton>
              <Button className="cursor-pointer ml-2">Sign out</Button>
            </SignOutButton>
          </SignedIn>
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          whileTap={{ scale: 0.9 }}
        >
          <Menu className="h-6 w-6 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-popover z-50 pt-24 px-4 md:hidden w-full"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* close button */}
            <motion.button
              className="absolute top-6 right-6 p-2"
              onClick={toggleMenu}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <X className="h-6 w-6 text-muted-foreground" />
            </motion.button>
            {/* menu items */}
            <div className="flex flex-col space-y-6 w-full">
              {menuItems.map((item, i) => {
                const isActive = item.href === pathname;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center text-sm text-muted-foreground hover:text-foreground transition-colors font-medium cursor-pointer rounded-full",
                        isActive &&
                          "text-primary bg-primary/10 rounded-full py-2 hover:bg-primary/20 hover:text-primary transition-all duration-300 ease-in-out"
                      )}
                      onClick={() => handleMobileNavigate(item.href)}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                );
              })}

              {/* Mobile Profile and Theme Toggler */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex flex-col items-start gap-2 justify-center"
              >
                <AnimatedThemeToggler barType="navbar" />
                <SignedOut>
                  <Button
                    className="cursor-pointer w-full h-full"
                    onClick={() => clerk.openSignIn()}
                  >
                    Sign in
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton
                    showName={true}
                    appearance={{
                      elements: {
                        userButtonBox: "text-foreground w-full rounded-full",
                      },
                    }}
                  />
                  <SignOutButton>
                    <Button className="cursor-pointer w-full h-full mt-2">
                      Sign out
                    </Button>
                  </SignOutButton>
                </SignedIn>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingNavBar;

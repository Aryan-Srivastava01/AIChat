import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { shadcn } from "@clerk/themes";
import App from "../../App";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

const ThemeProvider = () => {
  return (
    <>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: shadcn,
        }}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    </>
  );
};

export default ThemeProvider;

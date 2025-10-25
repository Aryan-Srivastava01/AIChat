import { useAuth } from "@clerk/clerk-react";
import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loader from "@/components/loaders/Loader";

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoaded) return; // wait for clerk to load
    // if not signed in and not already on home page, redirect to home
    if (!isSignedIn && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, location.pathname]);

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  // if not signed in, show unauthorized message
  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        Unauthorized
      </div>
    );
  }

  // if signed in, show children
  return <>{children}</>;
};

export default AuthProvider;

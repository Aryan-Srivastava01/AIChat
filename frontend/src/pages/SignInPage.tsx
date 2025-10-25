import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
  return (
    <div className="flex items-end justify-center min-h-screen w-screen max-w-screen-lg mx-auto py-10">
      <SignIn />
    </div>
  );
};

export default SignInPage;

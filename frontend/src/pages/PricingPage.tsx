import { PricingTable } from "@clerk/clerk-react";

const PricingPage = () => {
  return (
    <div className="flex flex-col items-center justify-start h-screen w-screen mx-auto max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl px-2 sm:px-0 gap-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Pricing</h1>
      <PricingTable />
    </div>
  );
};

export default PricingPage;

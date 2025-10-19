import { PricingTable } from "@clerk/clerk-react";

const PricingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen w-screen mx-auto max-w-lg sm:max-w-xl lg:max-w-4xl xl:max-w-7xl px-2 sm:px-0">
      <PricingTable />
    </div>
  );
};

export default PricingPage;

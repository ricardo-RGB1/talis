import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full p-4 border-t flex bg-slate-100">
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full">
        <div className="space-x-4 md:block md:w-auto m-auto flex items-center w-full text-slate-500">
          <Button size="sm" variant="ghost">
            Privacy Policy
          </Button>
          <Button size="sm" variant="ghost">Terms of Service</Button>
          <Button size="sm" variant="ghost">Copyright {'\u00A9'} 2024 Talis</Button>
        </div>
      </div>
    </div>
  );
};

// using export only for individual components (use export default for pages)

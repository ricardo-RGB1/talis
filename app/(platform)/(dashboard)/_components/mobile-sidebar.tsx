"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";

export const MobileSidebar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const isOpen = useMobileSidebar((state) => state.isOpen); // <-- this is the state
  const onOpen = useMobileSidebar((state) => state.onOpen); // <-- this is the action
  const onClose = useMobileSidebar((state) => state.onClose); // <-- this is the action


/**
 * Sets the `isMounted` state to `true` using a hack.
 * This effect runs only once, when the component is mounted.
 */
useEffect(() => {
    // <-- this is the hack
    setIsMounted(true);
}, []);
// The useEffect hook only runs on the client, so we need to use a hack to prevent the server from rendering the mobile sidebar component.

 
/**
 * Executes the onClose function when the pathname or onClose dependency changes.
 */
useEffect(() => {
    onClose();
}, [pathname, onClose]);


if (!isMounted) return null; // <-- this is the hack



return (
   <>
    <Button 
        onClick={onOpen}
        className="block md:hidden mr-2"
        variant='ghost'
        size='sm'
    >
        <Menu className="h-4 w-4" />
    </Button>
    <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent 
            side='left'
            className='p-2 pt-10'
        >
            <Sidebar 
                storageKey="t-sidebar-mobile-state"
            />
        </SheetContent>
    </Sheet>
   </>
  );
};


  // Sequence of events for the isMounted hack:
  // The component renders for the first time. At this point, isMounted is false, so the component returns null and nothing is rendered on the screen.
  // After the first render, the useEffect hook runs and sets isMounted to true.
  // This state change causes the component to re-render. This time, isMounted is true, so the component returns the JSX for the mobile sidebar, which is then rendered on the screen.
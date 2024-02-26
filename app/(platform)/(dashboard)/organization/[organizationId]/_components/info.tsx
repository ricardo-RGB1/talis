"use client";

import { Skeleton } from "@/components/ui/skeleton";
// Import the useOrganization hook from the Clerk SDK
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";

interface InfoProps {
  isPro: boolean;
}

/**
 * Renders the organization information.
 */
export const Info = ({ isPro }: InfoProps) => {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded) {
    // If the organization is not loaded, display a loading message
    return <Info.Skeleton />;
  }

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Image
          fill
          src={organization?.imageUrl!}
          alt="Organization logo"
          className="rounded-md object-cover"
        />
      </div>
      <div className="spacy-y-1">
        <p className="font-semibold text-xl">{organization?.name}</p>
        {/* this will be dynamic when implementing subscriptions */}
        <div className="flex items-center text-xs text-muted-foreground">
          <CreditCard className="h-3 w-3 mr-1" />
          {isPro ? "Pro" : "Free"}
        </div>
      </div>
    </div>
  );
};

/**
 * Renders a skeleton component for the Info component.
 */
Info.Skeleton = function SkeletonInfo() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center">
          <Skeleton className="h-3 w-3 mr-2" />
          <Skeleton className="h-3 w-[75px]" />
        </div>
      </div>
    </div>
  );
};

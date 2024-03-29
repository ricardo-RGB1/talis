"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion } from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

import { NavItem, Organization } from "./nav-item";

interface SidebarProps {
  storageKey?: string;
}

export const Sidebar = ({ storageKey = "t-sidebar-state" }: SidebarProps) => {
  // A custom hook that tracks which accordion is open in local storage
  const [openAccordion, setOpenAccordion] = useLocalStorage<
    Record<string, any>
  >(storageKey, {});

  // Get the organization as an alias for the active organization
  const { organization: activeOrganization, isLoaded: isOrganizationLoaded } =
    useOrganization();

  // Custom hook to get the list of organizations the user is a member of.
  const { userMemberships, isLoaded: isOrganizationListLoaded } =
    useOrganizationList({
      userMemberships: {
        infinite: true, // Load all organizations the user is a member of
      },
    });

  /**
   * Initializes the default accordion state based on the provided openAccordion object.
   * @param openAccordion - An object representing the open state of each accordion.
   * @returns An array of accordion keys that are initially open.
   */
  const defaultAccordionState: string[] = Object.keys(openAccordion).reduce(
    (acc: string[], key: string) => {
      if (openAccordion[key]) {
        acc.push(key);
      }
      return acc;
    },
    []
  ); // Reduce the openAccordion object to an array of keys that are open

  /**
   * Opens or closes the accordion with the specified ID.
   * @param id - The ID of the accordion to open or close.
   */
  const onOpenAccordion = (id: string) => {
    setOpenAccordion((curr) => ({
      ...curr,
      [id]: !openAccordion[id], // Toggle the current state of the accordion
    }));
  };

  // If the organization list is not loaded, return a loading indicator
  if (
    !isOrganizationLoaded ||
    !isOrganizationListLoaded ||
    userMemberships.isLoading
  ) {
    return ( 
      <>
        <div className="flex items-center justify-between mb-2">
          <Skeleton className="h-6 w-[45%]" />
          <Skeleton className="h-6 w-10" />
        </div>
        <div className="space-y-2">
          <NavItem.Skeleton />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="font-medium text-xs flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          size="icon"
          variant="ghost"
          className="ml-auto"
        >
          <Link href="/select-org">
            <Plus className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionState}
        className="space-y-2"
      >
        {userMemberships.data.map(({ organization }) => (
          <NavItem
            key={organization.id}
            isActive={activeOrganization?.id === organization.id} // Check if the organization is active
            isExpanded={openAccordion[organization.id]} // Check if the accordion is open
            organization={organization as Organization}
            onExpand={onOpenAccordion} // Pass the onOpenAccordion function to the NavItem
          />
        ))}
      </Accordion>
    </>
  );
};

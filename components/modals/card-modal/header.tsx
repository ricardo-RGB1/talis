"use client";

import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { Layout } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  data: CardWithList; // the card data with associated list
}

/**
 * Renders the header component for the card modal.
 *
 * @param {Object} data - The data object containing the title.
 * @returns {JSX.Element} The rendered header component.
 */
export const Header = ({ data }: HeaderProps) => {
  const [title, setTitle] = useState(data.title); // set the title to the card title

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form>
          <FormInput
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
      </div>
    </div>
  );
};



Header.Skeleton = function HeaderSkeleton() {
  // the skeleton component for the header
  return (
    <div className="flex items-start gap-x-3 mb-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="w-24 h-6 mb-1 bg-neutral-200" />
        <Skeleton className="w-12 h-4 bg-neutral-200" />
      </div>
    </div>
  );
};

// The purpose of the Header.Skeleton component is to provide a loading state for the header component. This is useful for when the card data is being fetched and the title is not yet available. The skeleton component is a visual representation of the header component that is displayed while the card data is being fetched. This provides a better user experience by indicating that the card data is being loaded. Also, including the Skeleton component fixes the TypeError message: 
// Cannot read properties of null (reading '{data.title}'), because the Header component is being rendered before the card data is available. By using the Skeleton component, the header component is rendered with a loading state while the card data is being fetched, and the TypeError message is avoided.
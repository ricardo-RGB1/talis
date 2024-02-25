"use client";

import { FormInput } from "@/components/form/form-input";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import { useParams } from "next/navigation";
import { ElementRef, useRef, useState } from "react";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

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
  const queryClient = useQueryClient(); // use the query client to access the query cache
  const params = useParams(); // get the current route parameters


  /**
   * Executes the updateCard action and handles the success and error cases.
   *
   * @remarks
   * This hook is used to update a card and perform additional actions based on the result.
   *
   * @param updateCard - The updateCard action function.
   * @param onSuccess - The callback function to be executed when the card is successfully updated.
   * @param onError - The callback function to be executed when an error occurs during the update.
   *
   * @returns An object with the `execute` function to trigger the updateCard action.
   */
  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        // invalidate the card query to refetch the card data
        queryKey: ["card", data.id],
      });

      // show a success toast message when the card is updated
      toast.success(`Renamed card to ${data.title}`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const inputRef = useRef<ElementRef<"input">>(null); // create a ref for the input element

  const [title, setTitle] = useState(data.title); // set the title to the card title

  // submit the form when the input loses focus
  const onBlur = () => {
    inputRef.current?.form?.requestSubmit();
  };

  // the function to handle the form submission
  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string; // get the title from the form data
    const boardId = params.boardId as string; // get the board ID from the route parameters

    // if the title is the same as the current title, break the function
    if (title === data.title) {
      return;
    }

    // update the card with the new title
    execute({
      title,
      boardId,
      id: data.id,
    });
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <Layout className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <FormInput
            ref={inputRef}
            onBlur={onBlur} // call the onBlur function when the input loses focus
            id="title"
            defaultValue={title}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{data.list.title}</span>
        </p>
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

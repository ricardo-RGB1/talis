"use client";

import { List } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/delete-list";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/copy-list";

interface ListOptionsProps {
  data: List;
  onAddCard: () => void; // The function to add a card to the list.
}

export const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null); // The close button for the popover.

  /**
   * Executes the deleteList action and handles the success and error cases.
   *
   * @param {Object} data - The data returned from the deleteList action.
   * @param {string} data.title - The title of the deleted list.
   * @param {Function} error - The error callback function.
   */
  const { execute: executeDeleteList } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} deleted`);
      closeRef.current?.click(); // Close the popover after the list is deleted.
    },
    onError: (error) => {
      toast.error(error);
    },
  });




/**
 * Executes the copyList action and handles the success and error cases.
 *
 * @remarks
 * This function is used to copy a list and display a success toast message when the copy is successful.
 * If an error occurs during the copy process, an error toast message is displayed.
 *
 * @param onSuccess - The callback function to be executed when the copyList action is successful.
 * @param onError - The callback function to be executed when an error occurs during the copyList action.
 */
const { execute: executeCopyList } = useAction(copyList, {
    onSuccess: (data) => {
        toast.success(`List ${data.title} copied`);
        closeRef.current?.click(); // Close the popover after the list is deleted.
    },
    onError: (error) => {
        toast.error(error);
    },
});

  /**
   * Handles the form submission for deleting the list.
   * @param {FormData} formData - The form data containing the list id and board id.
   */
  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDeleteList({ id, boardId }); // Execute the deleteList action with the list id and board id.
  };


/**
 * Handles the copy action for a list.
 * 
 * @param formData - The form data containing the id and boardId of the list.
 */
const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeCopyList({ id, boardId }); // Execute the copyList action with the list id and board id.
};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List Actions
        </div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Add card
        </Button>
        <form action={onCopy}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            Copy list
          </FormSubmit>
        </form>
        <Separator className="my-2" />

        <form action={onDelete}>
          <input hidden name="id" id="id" value={data.id} />
          <input hidden name="boardId" id="boardId" value={data.boardId} />
          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            Delete list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

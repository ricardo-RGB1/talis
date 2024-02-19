"use client";

import { updateList } from "@/actions/update-list";
import { FormInput } from "@/components/form/form-input";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { useState, useRef, ElementRef } from "react";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import {ListOptions} from "./list-options";

interface ListHeaderProps {
  data: List; // The data for the list header.
  onAddCard: () => void; // The callback for adding a new card to the list.
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title); // The title of the list header.
  const [isEditing, setIsEditing] = useState(false); // Whether the title is being edited.

  const formRef = useRef<ElementRef<"form">>(null); // The form element for editing the title.
  const inputRef = useRef<ElementRef<"input">>(null); // The input element for editing the title.

  /**
   * Enables editing mode for the list header.
   */
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  // Disables editing mode for the list header.
  const disableEditing = () => {
    setIsEditing(false);
  };

  /**
   * Updates the list with the provided title and disables editing mode.
   * @param {string} title - The new title for the list.
   */
  const { execute } = useAction(updateList, {
    // The action to update the list.
    onSuccess: (data) => {
      toast.success(`Renamed list to "${data.title}"`);
      setTitle(data.title);
      disableEditing(); // Disable editing mode after the list is updated.
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  /**
   * Handles the form submission for updating the list header.
   * If the title hasn't changed, it disables editing mode.
   * Otherwise, it updates the list with the new title.
   *
   * @param formData - The form data containing the updated title, id, and boardId.
   */
  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === data.title) {
      return disableEditing(); // Disable editing mode if the title hasn't changed.
    }

    execute({ title, id, boardId }); // Update the list with the new title.
  };

  const onBlur = () => {
    // Handles the blur event for the input element.
    formRef.current?.requestSubmit(); // Submit the form when the input loses focus.
  };

  /**
   * Handles the keydown event and submits the form when the "Escape" key is pressed.
   * @param event The keyboard event.
   */
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      formRef.current?.requestSubmit(); // Submit the form.
    }
  };

  useEventListener("keydown", onKeyDown); // Listen for the "keydown" event.

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form
          ref={formRef} // The form element for editing the title.
          action={handleSubmit} // The form submission handler.
          className="flex-1 px-[2px]"
        >
          <input hidden id="id" name="id" value={data.id} />
          <input hidden id="boardId" name="boardId" value={data.boardId} />
          <FormInput
            ref={inputRef}
            onBlur={onBlur} // The blur event handler for the input element.
            id="title"
            placeholder="Enter a title for this list..."
            defaultValue={title}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />
          <button type="submit" hidden /> 
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}
      <ListOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};

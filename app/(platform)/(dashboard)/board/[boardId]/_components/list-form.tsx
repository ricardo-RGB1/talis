"use client";

import { Plus, X } from "lucide-react";
import { useState, useRef, ElementRef } from "react";
import { useParams, useRouter } from "next/navigation";

import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { ListWrapper } from "./list-wrapper";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const ListForm = () => {
  const router = useRouter();
  const params = useParams(); // Get the boardId from the URL
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);

  /**
   * Enables editing mode for the list form.
   */
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  /**
   * Disables editing mode for the list form.
   */
  const disableEditing = () => {
    setIsEditing(false);
  };



  /**
   * Creates a new list and handles the execution of the createList action.
   *
   * @remarks
   * This hook provides the `execute` function to trigger the createList action,
   * as well as the `fieldErrors` object to handle any errors that occur during the execution.
   *
   * @param createList - The createList action function.
   * @param onSuccess - The callback function to be executed when the createList action is successful.
   * @param onError - The callback function to be executed when an error occurs during the createList action.
   */
  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created`);
      disableEditing();
      router.refresh(); // Refresh server components
    },
    onError: (error) => {
      toast.error(error);
    },
  });




  /**
   * Handles the keydown event and disables editing if the 'Escape' key is pressed.
   * @param {KeyboardEvent} e - The keyboard event object.
   * @returns {void}
   */
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown); // Attach the event listener
  useOnClickOutside(formRef, disableEditing); // Attach the event listener


/**
 * Handles the form submission.
 * 
 * @param formData - The form data.
 */
const onSubmit = (formData: FormData) => {
  const title = formData.get("title") as string;
  const boardId = formData.get("boardId") as string;

  execute({ title, boardId });
}
  

  // If the list form is in editing mode, render the form.
  if (isEditing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <FormInput
            errors={fieldErrors} 
            ref={inputRef}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title..."
          />
          <input
            hidden
            value={params.boardId} // Pass the boardId as a hidden input
            name="boardId"
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};

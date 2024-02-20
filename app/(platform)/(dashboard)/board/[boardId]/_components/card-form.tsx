"use client";

import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { useOnClickOutside, useEventListener } from "usehooks-ts";

import { useRef, ElementRef, KeyboardEventHandler, forwardRef } from "react";
import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/create-card";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean; // Whether the card form is being edited.
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    /**
     * Creates a new card and handles the form submission.
     *
     * @remarks
     * This hook uses the `useAction` hook to execute the `createCard` action.
     * It provides an `onSuccess` callback to display a success toast message and reset the form,
     * and an `onError` callback to display an error toast message.
     *
     * @returns An object containing the `execute` function to trigger the card creation,
     * and `fieldErrors` to handle any validation errors.
     */
    const { execute, fieldErrors } = useAction(createCard, {
        onSuccess: (data) => {
            toast.success(`Card "${data.title}" created successfully!`);
            formRef.current?.reset(); // Resets the form.
        },
        onError: (error) => {
            toast.error("An error occurred while creating the card.");
        },
    });



    const onKeyDown = (e: KeyboardEvent) => {
      // Handles the keydown event for the card form.
      if (e.key === "Escape") {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing); // Closes the card form when clicking outside of it.
    useEventListener("keydown", onKeyDown); // Listens for the keydown event.

    // Handles the keydown event for the textarea.
    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Prevents the default behavior of the textarea.
        formRef.current?.requestSubmit(); // Submits the form.
      }
    };

    // Handles the submit event for the card form.
    const onSubmit = (formData: FormData) => {
      // Submits the form data.
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      execute({ title, listId, boardId }); // Creates a new card.
    };

    // If the card form is being edited, display the form.
    if (isEditing) {
      return (
        <form ref={formRef} action={onSubmit} className="m-1 py-0.5 space-y-4">
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card"
            errors={fieldErrors}
          />
          <input hidden id="listId" name="listId" value={listId} />
          <div className="flex items-center justify-between gap-x-1 px-1">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div>
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          size="sm"
          variant="ghost"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm"; // The display name for the CardForm component.

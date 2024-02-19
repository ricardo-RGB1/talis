"use client";

import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { forwardRef } from "react";

interface CardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean; // Whether the card form is being edited.
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, enableEditing, disableEditing, isEditing }, ref) => {
    // If the card form is being edited, display the form.
    if (isEditing) {
      return (
        <form className="m-1 py-0.5 space-y-4">
          <FormTextarea
            id="title"
            onKeyDown={() => {}}
            ref={ref} 
            placeholder="Enter a title for this card"
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

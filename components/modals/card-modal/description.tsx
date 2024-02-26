"use client";
import { FormSubmit } from "@/components/form/form-submit";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { toast } from "sonner";

interface DescriptionProps {
  data: CardWithList; // the card data with associated list
}

/**
 * Renders the description component.
 *
 * @param {DescriptionProps} props - The component props.
 * @param {string} props.data.description - The description data.
 * @returns {JSX.Element} The rendered description component.
 */
export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient(); // use the query client to access the query cache
  const params = useParams(); // get the current route parameters

  // For editing the description
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<ElementRef<"textarea">>(null); // create a ref for the textarea element
  const formRef = useRef<ElementRef<"form">>(null); // create a ref for the form element

  // enable editing when the edit button is clicked
  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      // focus on the textarea when editing is enabled
      textareaRef.current?.focus();
    }, 0);
  };

  // disable editing when the form is submitted
  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing(); // disable editing when the escape key is pressed
    }
  };

  useEventListener("keydown", onKeydown); // listen for keydown events
  useOnClickOutside(formRef, disableEditing); // listen for click events outside the form


  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
        queryClient.invalidateQueries({  // invalidate the card query to refetch the card data
            queryKey: ['card', data.id],
        });
        queryClient.invalidateQueries({ // invalidate the card log query
          queryKey: ["card-logs", data.id],
        });
        // show a success toast message when the card is updated
        toast.success(`Updated card description`); 
        // disable editing after the card is updated
        disableEditing();
    }, 
    onError: (error) => {
        toast.error(error); // show an error toast message when an error occurs during the update
    },
  });  



  // handle the form submission to update the card description
  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    execute({ // update the card with the new description
        id: data.id, 
        description,
        boardId,
      });
  
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {/* If the user is editing the description, show the form */}
        {isEditing ? (
          <form
            action={onSubmit}
            ref={formRef}
            className='space-y-2'
          >
            <FormTextarea
                id='description'
                className='w-full mt-2'
                placeholder="Add a more detailed description..."
                defaultValue={data.description || undefined}
                errors={fieldErrors}
                ref={textareaRef} // set the ref for the textarea element
        
            />
            <div className="flex items-center gap-x-2">
                <FormSubmit>
                    Save
                </FormSubmit>
                <Button
                    type="button"
                    onClick={disableEditing}
                    size="sm"
                    variant="ghost"
                >
                    Cancel
                </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};



Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="h-6 w-24 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};

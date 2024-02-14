"use client";

import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Board } from "@prisma/client";

import { updateBoard } from "@/actions/update-board";
import { useAction } from "@/hooks/use-action";

import { useState, ElementRef, useRef } from "react";
import { toast } from "sonner";

interface BoardTitleFormProps {
  data: Board;
}

export const BoardTitleForm = ({ data }: BoardTitleFormProps) => {
  // Use the updateBoard action
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board "${data.title}" updated successfully`);
      setTitle(data.title); 
      disableEditing();
    }, 
    onError: (error) => {
      toast.error(error);
    }
  })



  const formRef = useRef<ElementRef<"form">>(null); // A ref to the form element
  const inputRef = useRef<ElementRef<"input">>(null); // A ref to the input element

  // A state to keep track of whether the title is being edited
  const [isEditing, setIsEditing] = useState(false); 
   // A state to keep track of the title [boardTitleForm.tsx
  const [title, setTitle] = useState(data.title);

  // A function to enable editing
  const enableEditing = () => {
    setIsEditing(true);
    // Wait for the next tick to focus on the input
    setTimeout(() => {
      inputRef.current?.focus(); // Focus on the input
      inputRef.current?.select(); // Select the text in the input
    })
  }
 

  // A function to disable editing
  const disableEditing = () => {
    setIsEditing(false);
  };

  // A function to handle form submission
  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string; // Get the title from the form data
    
    execute({ // Execute the updateBoard action
      title,
      id: data.id,
    })
  }

  // A function to handle the blur event on the input
  const onBlur = () => {
    formRef.current?.requestSubmit(); // Submit the form
  }

  // if the button title is in editing state, render a form
  if (isEditing) {
    return (
      <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2"> 
        <FormInput 
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none" 
        />
      </form>
    );
  }


  return (
    <Button
      onClick={enableEditing}
      variant="transparent"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
};
   
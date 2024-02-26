'use client'; 

import { useRef, ElementRef } from "react"; 
import { useRouter } from "next/navigation";
import { toast } from 'sonner'; 
import {
    Popover,
    PopoverContent, 
    PopoverTrigger,
    PopoverClose,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/create-board";


import { FormInput } from "./form-input";
import { FormSubmit } from './form-submit';
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { FormPicker } from './form-picker';
import { useProModal } from "@/hooks/use-pro-modal";




interface FormPopoverProps {
    children: React.ReactNode; // The trigger for the popover
    side?: 'left' | 'right' | 'top' | 'bottom';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
}; 



export const FormPopover = ({
    children,
    side, 
    align,
    sideOffset = 0,
}: FormPopoverProps) => {
    const proModal = useProModal(); // get the pro modal context
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null) // this will be used to close the popover.
    
    
    // this will create a new board.
    const { execute, fieldErrors } = useAction(createBoard, { 
        onSuccess: (data) => {
            toast.success('Board created successfully');
            closeRef.current?.click(); // this will close the popover.
            router.push(`/board/${data.id}`); // this will redirect the user to the board page.
        },
        onError:(error) => {
            toast.error(error); // this will display an error message.
            proModal.onOpen(); // this will open the pro modal.
        }
    });


  
    /**
     * Handles the form submission.
     * 
     * @param formData - The form data.
     */
    const onSubmit = (formData: FormData) => {
        const title = formData.get('title') as string; 
        const image = formData.get('image') as string; 
        execute({title, image});
     
    }


    return (
        <Popover>
          <PopoverTrigger asChild> 
            {children}
          </PopoverTrigger>
          <PopoverContent
            align={align}
            className="w-80 pt-3"
            side={side}
            sideOffset={sideOffset}
          >
            <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                Create board
            </div>

            <PopoverClose ref={closeRef} asChild> 
                <Button 
                    className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
                    variant='ghost'
                >
                    <X className="w-4 h-4" /> 
                </Button>
            </PopoverClose>

            <form action={onSubmit} className="space-y-4">
                <div className="space-y-4">
                    <FormPicker 
                        id='image' 
                        errors={fieldErrors}
                    />
                    <FormInput 
                        id='title'
                        label='Board title' 
                        type='text'
                        errors={fieldErrors}
                    />
                </div>
                <FormSubmit className="w-full">
                    Create
                </FormSubmit>
            </form>

          </PopoverContent> 
        </Popover> 
    )
}



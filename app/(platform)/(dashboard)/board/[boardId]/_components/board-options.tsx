"use client";

import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/delete-board";
import { useAction } from "@/hooks/use-action";
import { toast } from "sonner";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MoreHorizontal, X } from "lucide-react";

interface BoardOptionsProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionsProps) => {

  // Use the useAction hook to execute the deleteBoard action
  const { execute, isLoading } = useAction(deleteBoard, { 
    onError: (error) => {
      toast.error(error); 
    }
  }); 

  // handle the delete board action
  const handleDeleteBoard = () => {
    execute({ id }); // execute the deleteBoard action with the board id
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="transparent" className="h-auto w-auto p-2">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 pt-3 pb-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button 
            variant="ghost"
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
          >
          <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button 
          variant='ghost'
          onClick={handleDeleteBoard} // handle the delete board action
          disabled={isLoading} // disable the button if the action is loading
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};

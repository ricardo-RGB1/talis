"use client";

import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import { useCardModal } from "@/hooks/use-card-modal";

interface ActionProps {
  data: CardWithList; // the card data with associated list
}

export const Actions = ({ data }: ActionProps) => {
  const params = useParams(); // get the current route params
  const cardModal = useCardModal(); // get the card modal context

  // Create the copy and delete card actions:
  const { execute: executeCopyCard, isLoading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: () => {
        toast("Card copied successfully");
        cardModal.onClose(); // close the card modal
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  // Create the delete card action
  const { execute: executeDeleteCard, isLoading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast("Card deleted successfully");
        cardModal.onClose(); // close the card modal
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  // Handle the copy action
  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({ id: data.id, boardId }); // execute the copy card action
  };

  // Handle the delete action
  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({ id: data.id, boardId }); // execute the delete card action
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>
      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>
      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        className="w-full justify-start"
        size="inline"
      >
        <Trash className="w-4 h-4 mr-2" />
        Delete
      </Button>
    </div>
  );
};

// Create the skeleton for the actions component:
Actions.Skeleton = function ActionSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};

"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { updateCardOrder } from "@/actions/update-card-order";
import { toast } from "sonner";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

/**
 * Reorders the elements in the list based on the provided start and end indices.
 *
 * @template T The type of elements in the list.
 * @param {T[]} list The list of elements to be reordered.
 * @param {number} startIndex The index of the element to be moved.
 * @param {number} endIndex The index where the element should be moved to.
 * @returns {T[]} The reordered list.
 */
function reorder<T>(list: T[], startIndex: number, endIndex: number): T[] {
  const result = Array.from(list); // Create a copy of the list
  const [removed] = result.splice(startIndex, 1); // Remove the element from the list
  result.splice(endIndex, 0, removed); // Insert the removed element at the new index position

  return result;
}

/**
 * Renders a container component for displaying a list of items.
 *
 * @param {Object} props - The component props.
 * @param {Array} props.data - The list data to be displayed.
 * @param {string} props.boardId - The ID of the board.
 * @returns {JSX.Element} The rendered list container component.
 */
export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data); // The ordered list data

  /**
   * Executes the updateListOrder action and handles the success and error cases.
   *
   * @remarks
   * This function is used to update the order of a list.
   *
   * @param onSuccess - The callback function to be executed when the list order is successfully updated.
   * @param onError - The callback function to be executed when an error occurs during the update.
   * @returns - None.
   */
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  /**
   * Executes the updateCardOrder action and handles the success and error cases.
   * @returns {void}
   */
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  // Order the lists by their position
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result; // Destructure the result object
    // If there is no destination, return early
    if (!destination) {
      return;
    }
    // If the destination and source are the same, return early
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // If the type of the drag is a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // If the type of the drag is a card
    if (type === "card") {
      let newOrderedData = [...orderedData]; // Create a copy of the ordered data

      // Find the source and destination lists
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId // Find the source list
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId // Find the destination list
      );

      // If the source and destinaiton lists are not found, return early
      if (!sourceList || !destinationList) {
        return;
      }

      // Check if cards exists on the source and destination lists:
      if (!sourceList.cards) {
        // If the source list has no cards
        sourceList.cards = []; // Set the cards to an empty array
      }
      if (!destinationList.cards) {
        // If the destination list has no cards
        destinationList.cards = []; // Set the cards to an empty array
      }

      // If user is moving the card in the same list (reordering the cards)
      if (source.droppableId === destination.droppableId) {
        // Reorder the cards in the source list
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        // Update the source list with the reordered cards
        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderedCards; // Set the source list cards to the reordered cards

        setOrderedData(newOrderedData); // Update the ordered data with the new ordered data

        executeUpdateCardOrder({
          // Execute the updateCardOrder action
          items: reorderedCards,
          boardId: boardId,
        });
      } else {
        // If user is moving the card to a different list
        // Remove the card from the source list and insert it into the destination list
        const [removedCard] = sourceList.cards.splice(source.index, 1);
        // Update the list ID of the card to the destination list ID
        removedCard.listId = destination.droppableId;
        destinationList.cards.splice(destination.index, 0, removedCard);

        // Update the order of the cards in the source list
        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // Update the order of the cards in the destination list
        destinationList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData); // Update the ordered data with the new ordered data
        // TODO: Update the order of the cards in the database
        executeUpdateCardOrder({
          items: destinationList.cards,
          boardId: boardId,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(
          provided // Render the list of items
        ) => (
          <ol
            {...provided.droppableProps} // Attach the required props to the component
            ref={provided.innerRef} //
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} list={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

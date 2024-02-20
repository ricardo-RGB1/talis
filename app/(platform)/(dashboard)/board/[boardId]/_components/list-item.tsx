"use client";
import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";
import { cn } from "@/lib/utils";
import { CardItem } from "./card-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";

/**
 * Props for the ListItem component.
 */
interface ListItemProps {
  index: number;
  list: ListWithCards;
}

export const ListItem = ({ index, list }: ListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  // The textarea element for editing the list title.
  const textAreaRef = useRef<ElementRef<"textarea">>(null);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    // Enables editing of the list title.
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps} // Attach the required props to the component
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps} // When user clicks this div, they activate the drag and drop
            className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
          >
            <ListHeader onAddCard={enableEditing} data={list} />
            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <ol
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    list.cards.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {/* Render each card in the list */}
                  {list.cards.map((card, index) => (
                    <CardItem key={card.id} index={index} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={list.id}
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
};

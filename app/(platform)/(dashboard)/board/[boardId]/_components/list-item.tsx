"use client";
import { ListWithCards } from "@/types";
import { ListHeader } from "./list-header";
import { ElementRef, useRef, useState } from "react";
import { CardForm } from "./card-form";

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


  const enableEditing = () => { // Enables editing of the list title.
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    }, 0);
  };

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader onAddCard={enableEditing} data={list} />
        <CardForm
          listId={list.id}
          ref={textAreaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </li>
  );
};

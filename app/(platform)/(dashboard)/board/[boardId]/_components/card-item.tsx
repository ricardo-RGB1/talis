"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

interface CardItemProps {
  index: number;
  data: Card;
}

export const CardItem = ({ index, data }: CardItemProps) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef} // This is the element that we want to attach the drag and drop functionality to
          role="button"
          className="truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
        </li>
      )}
    </Draggable>
  );
};

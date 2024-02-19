"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
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

  // Order the lists by their position
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list, index) => {
        return (
          <ListItem 
            key={list.id}
            index={index}
            list={list}
          />
          
        )
      })}
      <ListForm />
      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};

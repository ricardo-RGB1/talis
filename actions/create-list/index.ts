"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { CreateList } from "./schema";






/**
 * Handles the creation of a new list.
 * 
 * @param data - The input data for creating the list.
 * @returns A promise that resolves to the created list or an error object.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId } = data; // data is of type InputType
  let list; // The list that will be created

  try {
    const board = await db.board.findUnique({
      where: {
        id: boardId,
        orgId,
      },
    });

    if (!board) {
      // If the board is not found
      return {
        error: "Board not found",
      };
    }


    // Get the last list inside of the board so we can set the order of the new list
    const lastList = await db.list.findFirst({
      where: {
        boardId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });


    const newOrder = lastList ? lastList.order + 1 : 1; // If there are no lists, set the order to 1

    // Create the list
    list = await db.list.create({
      data: {
        title,
        boardId,
        order: newOrder, // Set the order of the new list
      },
    });
  } catch (error) {
    return {
      error: "An error occurred while creating the list",
    };
  }

  revalidatePath(`/board/${boardId}`); // Revalidate the board page

  return { data: list }; // Return the created list
};

// Export the action
export const createList = createSafeAction(CreateList, handler);

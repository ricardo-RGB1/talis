"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyList } from "./schema";

/**
 * Handles the copy list action.
 *
 * @param data - The input data for the action.
 * @returns A promise that resolves to the return type of the action.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    // Ensure the user is authenticated
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data; // data is of type InputType

  let list; // The list to copy

  // Try to copy the list
  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          // Ensure the list belongs to the user's organization
          orgId,
        },
      },
      include: {
        // Include the cards in the list
        cards: true,
      },
    });

    // Ensure the list exists
    if (!listToCopy) {
      return {
        error: "List not found",
      };
    }

    // Get the last list
    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    // set the new order to the last list order + 1 or 1 if there are no lists
    const newOrder = lastList ? lastList.order + 1 : 1;

    // Create the new list
    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} (copy)`,
        order: newOrder,
        cards: {
          // Create the new cards
          createMany: {
            // Create many cards
            data: listToCopy.cards.map((card) => ({
              // Map the cards to the new list
              title: card.title,
              description: card.description,
              order: card.order,
            })),
          },
        },
      },
      include: {
        // Include the cards in the list
        cards: true,
      },
    });
  } catch (error) {
    return {
      error: "Failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`); // Update the board page

  return { data: list };
};

// Export the action
export const copyList = createSafeAction(CopyList, handler);

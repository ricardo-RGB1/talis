"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardOrder } from "./schema";

/**
 * Updates the order of the cards in a list.
 *
 * @param data - The input data for the action.
 * @returns The result of the action.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data; // data is of type InputType

  let updatedCards; // The updated lists

  // Update the order of the lists
  try {
    const transaction = items.map((card) =>
      db.card.update({
        where: {
          id: card.id,
          list: {
            // Ensure the user is updating a card that belongs to the list
            board: {
              // Ensure the user is updating a card that belongs to the board
              orgId,
            },
          },
        },
        data: {
          order: card.order, // Update the order of the card
          listId: card.listId, // Update the listId of the card
        },
      })
    );

    updatedCards = await db.$transaction(transaction); // Execute the transaction
  } catch (error) {
    return {
      error: "An error occurred while updating the list order",
    };
  }

  revalidatePath(`/board/${boardId}`); // Revalidate the board page

  return { data: updatedCards }; // Return the updated lists
};

// Export the action
export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);

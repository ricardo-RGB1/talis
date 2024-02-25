"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCard } from "./schema";

/**
 * Updates a card in the database.
 *
 * @param data - The input data for updating the card.
 * @returns A promise that resolves to the updated card or an error object.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, ...values } = data;
  let card;

  try {
    // Try to update the card
    card = await db.card.update({
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
      data: {
        ...values, // Update the card with the new values
      },
    });
  } catch (error) {
    return {
      error: "Error updating board",
    };
  }

  revalidatePath(`/board/${boardId}}`); // Revalidate the board page

  return { data: card }; // Return the updated board
};

// Export the action
export const updateCard = createSafeAction(UpdateCard, handler);

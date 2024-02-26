"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCard } from "./schema";
import { createdAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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

  let card; // card is of type Card

  try {
    // Try to find the card
    const cardToCopy = await db.card.findUnique({
      where: {
        id,
        list: {
          // Ensure the card is in a list that is on the board
          board: {
            // Ensure the list is on the board
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) {
      return {
        error: "Card not found",
      };
    }

    /**
     * Represents the last card in the list.
     */
    const lastCard = await db.card.findFirst({
      where: { listId: cardToCopy.listId }, // Find the last card in the list
      orderBy: { order: "desc" }, // Order by the order field in descending order
      select: { order: true }, // Select the order field
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1; // Calculate the new order

    // Create the new card
    card = await db.card.create({
      data: {
        title: `${cardToCopy.title} (Copy)`, // Add (Copy) to the title
        description: cardToCopy.description, // Copy the description
        order: newOrder, // Set the new order
        listId: cardToCopy.listId, // Set the list ID
      },
    });

    // Create an audit log
    await createdAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`); // Update the board page

  return { data: card };
};

// Export the action
export const copyCard = createSafeAction(CopyCard, handler);

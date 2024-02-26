"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCard } from "./schema";
import { createdAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

/**
 * Handles the creation of a new list.
 *
 * @param data - The input data for creating the list.
 * @returns A promise that resolves to the created list or an error object.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  // If the user is not authenticated
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // The title of the list, the ID of the board the list belongs to, and the ID of the list
  const { title, boardId, listId } = data;

  let card; // The created card

  try {
    const list = await db.list.findUnique({
      // Find the list
      where: {
        // By the list ID
        id: listId,
        board: {
          // And the board ID
          orgId,
        },
      },
    });

    if (!list) {
      // If the list does not exist
      return {
        error: "List not found",
      };
    }

    const lastCard = await db.card.findFirst({
      // Find the last card
      where: { listId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastCard ? lastCard.order + 1 : 1; // The order of the new card

    // finally, create the card and set the order
    card = await db.card.create({
      data: {
        title,
        listId,
        order: newOrder,
      },
    });

    // Create an audit log for the created card
    await createdAuditLog({
      entityId: card.id,
      entityTitle: card.title,
      entityType: ENTITY_TYPE.CARD, // The entity type is a card
      action: ACTION.CREATE, // The action is create
    });
  } catch (error) {
    return {
      error: "An error occurred while creating the list",
    };
  }

  revalidatePath(`/board/${boardId}`); // Revalidate the board page

  return { data: card }; // Return the created list
};

// Export the action
export const createCard = createSafeAction(CreateCard, handler);

"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCard } from "./schema";
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
    card = await db.card.delete({
      // Delete the card
      where: {
        id,
        list: {
          board: {
            orgId,
          },
        },
      },
    });
    // Create an audit log
    await createdAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "Failed to delete card",
    };
  }

  revalidatePath(`/board/${boardId}`); // Update the board page

  return { data: card };
};

// Export the action
export const deleteCard = createSafeAction(DeleteCard, handler);

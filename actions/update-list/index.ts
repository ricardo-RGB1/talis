"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateList } from "./schema";
import { createdAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

/**
 * Updates a list in the database.
 *
 * @param data - The data containing the list information to be updated.
 * @returns A promise that resolves to the updated list or an error object.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, id, boardId } = data; // data is of type InputType

  let list; // The list to be updated

  // Update the board in the database
  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });
    // Create an audit log
    await createdAuditLog({
      entityTitle: list.title,
      entityId: list.id,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: "Error updating list",
    };
  }

  revalidatePath(`/board/${boardId}`); // Revalidate the board page

  return { data: list }; // Return the updated board
};

// Export the action
export const updateList = createSafeAction(UpdateList, handler);

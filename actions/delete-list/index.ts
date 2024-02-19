"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data; // data is of type InputType
  let list;

  // Delete the list from the database
  try {
    list = await db.list.delete({
      where: {
        id,
        boardId,
        board: {
          orgId, // Ensure the board belongs to the organization
        },
      },
    });
  } catch (error) {
    return {
      error: "Failed to delete board",
    };
  }

  revalidatePath(`/board/${boardId}`); // Update the board page

  return { data: list };
};

// Export the action
export const deleteList = createSafeAction(DeleteList, handler);



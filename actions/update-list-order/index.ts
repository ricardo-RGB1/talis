"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateListOrder } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { items, boardId } = data; // data is of type InputType

  let lists; // The updated lists

  // Update the order of the lists
  try {
    const transaction = items.map(
      (
        list // Map over the items
      ) =>
        db.list.update({
          //
          where: {
            id: list.id,
          },
          data: {
            order: list.order,
          },
        })
    );

    lists = await db.$transaction(transaction); // Execute the transaction
  } catch (error) {
    return {
      error: "An error occurred while updating the list order",
    };
  }

  revalidatePath(`/board/${boardId}`); // Revalidate the board page

  return { data: lists }; // Return the created list
};

// Export the action
export const updateListOrder = createSafeAction(UpdateListOrder, handler);

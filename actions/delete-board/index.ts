"use server";

import { auth } from "@clerk/nextjs";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { create } from "lodash";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteBoard } from "./schema";
import { redirect } from "next/navigation";
import { createdAuditLog } from "@/lib/create-audit-log";
import { ENTITY_TYPE, ACTION } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id } = data; // data is of type InputType
  let board;

  // Delete the board
  try {
    board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });
    // Create an audit log
    await createdAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: "Failed to delete board",
    };
  }

  revalidatePath(`/organization/${orgId}`); // Revalidate the organization page

  redirect(`/organization/${orgId}`); // Redirect to the organization page
};

// Export the action
export const deleteBoard = createSafeAction(DeleteBoard, handler);

// This TypeScript code defines an asynchronous function handler that deletes a board from a database and then redirects the user to an organization page. The function is then exported as an action using the createSafeAction function.

// The handler function takes an argument data of type InputType and returns a Promise that resolves to ReturnType. The InputType is expected to be an object that contains the id of the board to be deleted.

// At the start of the function, it calls the auth function to get the userId and orgId. If either of these values is not present, the function returns an error object with the message "Unauthorized".

// Next, it attempts to delete the board from the database using the db.board.delete method. This method is called with an object that specifies the id of the board to be deleted and the orgId. If the deletion fails for any reason, the function catches the error and returns an error object with the message "Failed to delete board".

// If the deletion is successful, the function calls revalidatePath with the path of the organization page. This is likely to update the data for that page to reflect the deletion of the board.

// Finally, the function calls redirect with the path of the organization page, which will navigate the user to that page.

// The handler function is then passed to the createSafeAction function along with DeleteBoard (which is likely a string or symbol representing the action type) to create an action. This action is then exported as deleteBoard. This action can be dispatched in a Redux store to perform the deletion of the board.

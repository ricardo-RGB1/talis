"use server";

import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
import { createdAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import {
  incrementAvailableCount,
  hasReachedMaxFreeBoards,
} from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

/**
 * Handles the creation of a board.
 *
 * @param data - The input data for creating the board.
 * @returns A promise that resolves to the created board or an error object.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth(); // this will get the user and org id from the session.

  // if the user or org id is missing, return an error.
  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  // this will check if the organization has reached the maximum number of free boards.
  const hasReachedMax = await hasReachedMaxFreeBoards();

  // this will check if the organization has a pro subscription.
  const isPro = await checkSubscription();

  // if the organization has reached the maximum number of free boards and is not a pro user, return an error.
  if (!hasReachedMax && !isPro) {
    return {
      error: "You have reached the maximum number of free boards.",
    };
  }

  const { title, image } = data; // this is the data that was passed in from the action function.

  /**
   * Splits the given image string into individual values.
   *
   * @param image - The image string to be split.
   * @returns An array containing the individual values of the image string.
   */
  const [imageId, imageThumbUrl, imageFullUrl, imageLinkHTML, imageUserName] =
    image.split("|");

  // if any of the required fields are missing, return an error.
  if (
    !imageId ||
    !imageThumbUrl ||
    !imageFullUrl ||
    !imageLinkHTML ||
    !imageUserName
  ) {
    return {
      error: "Missing fields. Failed to create board.",
    };
  }

  let board; // this will be the board that is created.

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName,
      },
    });

    if (!isPro) {
      // if the user is not a pro user, increment the available free boards count.
      await incrementAvailableCount();
    }

    // Create an audit log
    await createdAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: "Unable to create board.",
    };
  }

  revalidatePath(`/board/${board.id}`); // this will revalidate the cache for the board page.
  return { data: board };
};

// this is the action function that will be exported and used in the pages.
export const createBoard = createSafeAction(CreateBoard, handler);

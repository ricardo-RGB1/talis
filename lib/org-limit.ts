import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";

import { MAX_FREE_BOARDS } from "@/constants/boards";

/**
 * Increments the available count for an organization.
 * If the organization limit exists, the count is incremented by 1.
 * If the organization limit does not exist, a new organization limit is created with a count of 1.
 * @throws {Error} If the organization ID is not found.
 */
export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Organization ID not found");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  if (orgLimit) {
    // if orgLimit exists, increment the count
    await db.orgLimit.update({
      // update the count
      where: { orgId }, // find the orgLimit by orgId
      data: { count: orgLimit.count + 1 }, // increment the count by 1
    });
  } else {
    // if orgLimit does not exist, create a new orgLimit
    await db.orgLimit.create({
      // create a new orgLimit
      data: { orgId, count: 1 }, // set the count to 1
    });
  }
};

/**
 * Decreases the available count for an organization.
 * If the organization limit exists, it updates the count by subtracting 1.
 * If the organization limit does not exist, it creates a new limit with a count of 1.
 * @throws {Error} If the organization ID is not found.
 */
export const decreaseAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Organization ID not found");
  }

  // find the orgLimit by orgId
  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  
  if (orgLimit) { // if orgLimit exists and the count is greater than 0 (to prevent negative counts)
    await db.orgLimit.update({
      where: { orgId },
      data: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 }, // subtract 1 from the count
    });
  } else { // if orgLimit does not exist, create a new orgLimit with a count of 1
    await db.orgLimit.create({
      data: { orgId, count: 1 },
    });
  }
};

/**
 * Checks if the organization has reached the maximum number of free boards.
 * @returns {Promise<boolean>} A promise that resolves to true if the organization has reached the maximum number of free boards, false otherwise.
 * @throws {Error} If the organization ID is not found.
 */
export const hasReachedMaxFreeBoards = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Organization ID not found");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  // if orgLimit does not exist or the count is less than the maximum number of free boards, return true
  if (!orgLimit || orgLimit.count < MAX_FREE_BOARDS) {
    return true;
  } else {
    return false;
  }
};

/**
 * Retrieves the count of available free boards for the organization.
 * @returns {Promise<number>} The count of available free boards.
 */
export const getAvailableFreeBoards = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return 0; // the 0 will be used in the UI when this function is called
  }

  const orgLimit = await db.orgLimit.findUnique({
    // find the orgLimit by orgId
    where: { orgId }, // find the orgLimit by orgId
  });

  if (!orgLimit) {
    // if orgLimit does not exist, return 0
    return 0;
  }

  return orgLimit.count; // return the count
};

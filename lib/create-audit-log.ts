import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib/db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

/**
 * Creates an audit log entry in the Prisma database for the given properties.
 * @param {Props} props - The properties for the audit log entry.
 * @returns {Promise<void>} - A promise that resolves when the audit log entry is created.
 * @throws {Error} - If the user or orgId is not found.
 */
export const createdAuditLog = async (props: Props) => {
  try {
    const { orgId } = auth(); // Get the orgId from the user
    const user = await currentUser(); // Get the current user

    if (!user || !orgId) {
      // If the user or orgId is not found, throw an error
      throw new Error("User not found");
    }

    // Extract the properties from the props
    const { entityId, entityType, entityTitle, action } = props;

    // Create the audit log using the create() method from Prisma
    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user?.imageUrl,
        userName: user?.firstName + " " + user?.lastName,
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};

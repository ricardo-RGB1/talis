import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { ENTITY_TYPE } from "@prisma/client";

/**
 * Retrieves the audit logs for a specific card.
 * 
 * @param request - The HTTP request object.
 * @param params - The parameters object containing the cardId.
 * @returns A Promise that resolves to the audit logs.
 */
export async function GET(
  request: Request,
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth(); // Get the userId and orgId from the user

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find the audit logs for the specific card
    const auditLogs = await db.auditLog.findMany({
        where: { 
            orgId,
            entityId: params.cardId,
            entityType: ENTITY_TYPE.CARD
        },
        orderBy: { createdAt: "desc" },
        take: 3 // Limit the number of logs to 3
    });

    return NextResponse.json(auditLogs, { status: 200 }) // Return the audit logs

  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

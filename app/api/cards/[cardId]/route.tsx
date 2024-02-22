import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";



/**
 * Retrieves a card from the database based on the provided cardId and orgId.
 * 
 * @param req - The incoming request.
 * @param params - The parameters object containing the cardId parameter from the route.
 * @param params.cardId - The ID of the card to retrieve.
 * @returns A Promise that resolves to the retrieved card, including its associated list title.
 */
export async function GET(
  req: Request, // The incoming request.
  { params }: { params: { cardId: string } }
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new Response("Unauthorized", { status: 401 });
    }

    /**
     * Retrieves a card by its ID along with its associated list title.
     * 
     * @param cardId - The ID of the card to retrieve.
     * @returns A promise that resolves to the card object, including the associated list title.
     */
    const card = await db.card.findUnique({
      where: {
        id: params.cardId,
        list: {
          board: {
            orgId,
          }
        }
      },
      include: {
        list: {
          select: {
            title: true,
          }
        }
      }
    })


    
    return NextResponse.json(card); // Return the card as JSON: { id: string, title: string, list: { title: string } }

  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation"; 
import { ListContainer } from "./_components/list-container";

interface BoardIdPageProps {
    params: { boardId: string; }
}


const BoardIdPage = async ({
    params,
}: BoardIdPageProps) => {
    const { orgId } = auth(); // Get the orgId from the user's session

    if(!orgId) {
        redirect('/select-org');
    }


    // Fetch the board and its lists and cards
    const lists = await db.list.findMany({ // Fetch all lists that belong to the board
        where: {
            boardId: params.boardId, // Only fetch lists that belong to this board
            board: { // Only fetch lists that belong to a board that belongs to this organization
                orgId, 
            },
        },
        include: { // Also fetch the cards that belong to each list
            cards: { 
                orderBy: { // Order the cards by their position
                    order: 'asc',
                }
            }
        }, 
        orderBy: { // Order the lists by their position
            order: 'asc',
        }
    });



    return ( 
        <div className="p-4 h-full overflow-x-auto">
         <ListContainer 
            boardId={params.boardId}
            data={lists}
         />
        </div>
     );
}
 
export default BoardIdPage;
import { Board } from "@prisma/client";
import { BoardTitleForm } from "./board-title-form";


// The BoardNavbar component is a child component of the BoardLayout component. It is used to display the navigation bar for the board page. The BoardNavbar component takes the board data as a prop and displays the board title in the navigation bar.
interface BoardNavbarProps {
  data: Board; // The board data
}

export const BoardNavbar = async ({ data }: BoardNavbarProps) => {

    return (
        <div className="w-full h-14 z-[40] bg-black/50 fixed top-14 flex items-center px-6 gap-x-4 text-white">
         <BoardTitleForm data={data} />
        </div>
    );
};

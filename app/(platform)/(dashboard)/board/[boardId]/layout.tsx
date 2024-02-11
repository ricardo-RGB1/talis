import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/board-navbar";

export async function generateMetadata({
  params,
}: {
  params: { boardId: string }; 
}) {
  const { orgId } = auth();

  // If the user is not logged in, return the default title
  if (!orgId) {
    return {
      title: "Board",
    };
  }

  // Fetch the board from the database
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  // Return the board title as the page title
  return {
    title: board?.title || "Board",
  };
}

const BoardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { boardId: string };
}) => {
  const { orgId } = auth(); // orgId is the organization ID of the current user

  if (!orgId) {
    redirect("/select-org"); // redirect to the organization selection page
  }

  // Fetch the board from the database
  const board = await db.board.findUnique({
    where: {
      id: params.boardId,
      orgId,
    },
  });

  if (!orgId || !board) {
    notFound(); // return a 404 page
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
        <BoardNavbar data={board} />
        <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
};

export default BoardLayout;

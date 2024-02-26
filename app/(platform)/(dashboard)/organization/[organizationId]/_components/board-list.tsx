import { Hint } from "@/components/form/hint";
import { HelpCircle, Plus, User2 } from "lucide-react";
import { FormPopover } from "@/components/form/form-popover";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { getAvailableFreeBoards } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";

/**
 * Renders a list of boards.
 * Server components are used to fetch the data for the boards.
 */
export const BoardList = async () => {
  const { orgId } = auth(); // this will get the organization id from the user's session.

  // if the orgId is missing, redirect the user to the select-org page.
  if (!orgId) {
    return redirect("/select-org");
  }

  // this will get the boards for the organization.
  const boards = await db.board.findMany({
    where: {
      orgId,
    },
    orderBy: {
      createdAt: "desc",
    },
  }); 

  // this will get the number of available free boards for the organization.
  const availableFreeBoards = await getAvailableFreeBoards();

  // this will check if the organization has a pro subscription.
  const isPro = await checkSubscription(); 

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-lg text-neutral-700">
        <User2 className="w-6 h-6 mr-2" />
        Your boards
      </div>
      {/* Render the boards inside a grid and define the #columns in each VP */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* // Map over the boards and render each one as a link. */}
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/board/${board.id}`}
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            {/* self-closing div for hover effect */}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        {/* FormPopover */}
        <FormPopover side="right" sideOffset={10} align="center">
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition"
          >
            <div className="flex items-center">
              <Plus className="h-4 w-4 mr-1" />
              <p className="text-sm"> Create new board</p>
            </div>
            <span className="text-xs">
              {isPro ? "Unlimited" :`${MAX_FREE_BOARDS - availableFreeBoards} remaining`}
            </span>
            <Hint
              description={`Free workspaces can have up to 5 boards. Upgrade to a paid plan to create more.`}
              sideOffset={40}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};


BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};

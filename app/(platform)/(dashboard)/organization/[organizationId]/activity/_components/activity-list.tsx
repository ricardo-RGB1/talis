import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ActivityItem } from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";

import { db } from "@/lib/db";

export const ActivityList = async () => {
  const { orgId } = auth(); // This is the orgId of the currently logged in user

  if (!orgId) {
    redirect("/select-org");
  }

  const auditLogs = await db.auditLog.findMany({
    where: {
      // This is the query that will be used to get the data from the database
      orgId,
    },
    orderBy: {
      // This is the order in which the data will be returned
      createdAt: "desc",
    },
  });

  // auditLogs is an array of AuditLog objects that will be passed
  // to the ActivityItem component below

  return (
    <ol className="space-y-4 mt-4">
      <p className="hidden last:block text-xs text-center text-muted-foreground">
        No activity to show
      </p>
      {auditLogs.map((log) => (
        <ActivityItem key={log.id} data={log} />
      ))}
    </ol>
  );
};

// This is the skeleton loader for the ActivityList component
ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[50%]" />
      <Skeleton className="h-14 w-[70%]" />
      <Skeleton className="h-14 w-[80%]" />
      <Skeleton className="h-14 w-[75%]" />
    </ol>
  );
};

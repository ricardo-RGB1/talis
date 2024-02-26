"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Header } from "./header";
import { Description } from "./description";
import { Actions } from "./actions";
import { AuditLog } from "@prisma/client";
import { Activity } from "./activity";


/**
 * Renders a modal component for displaying card details.
 * Fetches the card data using the specified ID and displays the card title.
 */
export const CardModal = () => {
  const id = useCardModal((state) => state.id); // get the id from the store
  const isOpen = useCardModal((state) => state.isOpen); // get the isOpen from the store
  const onClose = useCardModal((state) => state.onClose); // get the onClose function from the store

  /**
   * Fetches the card data using the specified ID.
   *
   * @returns The card data with associated list.
   */
  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id], // use the card id as the query key
    queryFn: () => fetcher(`/api/cards/${id}`), // fetch the card data from the API
  });


  /**
   * Fetches the audit logs data for a card.
   * @returns The audit logs data.
   */
  const { data: auditLogsData } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id], // use the card id as the query key
    queryFn: () => fetcher(`/api/cards/${id}/logs`), // fetch the card data from the API
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {!auditLogsData ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogsData} />
              )}
            </div>
          </div>
          {!cardData ?
          <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

import { Card, List } from "@prisma/client";

// ListWithCards is a type that is a combination of List and Card[]
export type ListWithCards = List & { cards: Card[]}; 


// CardWithList is a type that is a combination of Card and List
export type CardWithList = Card & { list: List }; 
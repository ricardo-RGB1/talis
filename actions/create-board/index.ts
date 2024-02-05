'use server';


import { db } from "@/lib/db";
import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { revalidatePath} from 'next/cache'; 
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";
 

/**
 * Handles the creation of a board.
 * 
 * @param data - The input data for creating the board.
 * @returns A promise that resolves to the created board or an error object.
 */
const handler = async (data: InputType): Promise<ReturnType> => {
    const { userId } = auth(); 

    if(!userId) {
        return {
            error: "Unauthorized",
        }; 
    }

    const { title } = data; // this is the data that was passed in from the action function.

    let board; // this will be the board that is created.

    try{
        board = await db.board.create({
            data: {
                title 
            }
        })
    } catch(error) {
        return {
            error: "Unable to create board."
        }
    }

    revalidatePath(`/board/${board.id}`);
    return {data: board}; 

}

export const createBoard = createSafeAction(CreateBoard, handler); // this is the action function that will be exported and used in the pages. 
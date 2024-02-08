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
    const { userId, orgId } = auth();  // this will get the user and org id from the session.

    if(!userId || !orgId) {
        return {
            error: "Unauthorized",
        }; 
    }

    const { title, image } = data; // this is the data that was passed in from the action function.


    /** 
     * Splits the given image string into individual values.
     * 
     * @param image - The image string to be split.
     * @returns An array containing the individual values of the image string.
     */
    const [ 
         imageId,
         imageThumbUrl,
         imageFullUrl,
         imageLinkHTML,
         imageUserName 
    ] = image.split("|"); // this will split the image string into individual values.
  
     

    // if any of the required fields are missing, return an error.
    if(!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing fields. Failed to create board."
        }
    }



    let board; // this will be the board that is created.

    try{
        board = await db.board.create({
            data: { 
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageLinkHTML,  
                imageUserName,
            }
        })
    } catch(error) {
        return {
            error: "Unable to create board."
        }
    }

    revalidatePath(`/board/${board.id}`); // this will revalidate the cache for the board page.
    return {data: board}; 

}

// this is the action function that will be exported and used in the pages. 
export const createBoard = createSafeAction(CreateBoard, handler); 
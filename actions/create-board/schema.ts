import { z } from 'zod'; 

/**
 * Represents the schema for creating a board.
 */
export const CreateBoard = z.object({
    /**
     * The title of the board.
     * 
     * @remarks
     * This field is required and must be a string with a minimum length of 3 characters.
     */
    title: z.string({
        required_error: "Please enter a title for the board.",
        invalid_type_error: "Please enter a valid title for the board.",
    }).min(3, {
        message: "Please enter a title that is at least 3 characters long.",
    })
});

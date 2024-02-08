import { z } from 'zod'; 


/**
 * Represents the schema for creating a board.
 */
export const  CreateBoard = z.object({
    /**
     * The title of the board.
     * @required Please enter a title for the board.
     * @invalidType Please enter a valid title for the board.
     * @minLength 3 Please enter a title that is at least 3 characters long.
     */
    title: z.string({
        required_error: "Please enter a title for the board.",
        invalid_type_error: "Please enter a valid title for the board.",
    }).min(3, {
        message: "Please enter a title that is at least 3 characters long.",
    }),
    /**
     * The image of the board.
     * @required Please enter an image for the board.
     * @invalidType Please enter a valid image for the board.
     */
    image: z.string({
        required_error: "Please enter an image for the board.",
        invalid_type_error: "Please enter a valid image for the board.",
    })
});

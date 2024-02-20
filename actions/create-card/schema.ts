import { z } from "zod";



/**
 * Represents the schema for creating a card.
 */
export const CreateCard = z.object({
    title: z
        .string({
            required_error: "Title is required",
            invalid_type_error: "Title must be a string",
        })
        .min(3, {
            message: "Title must be at least 3 characters long",
        }),
    /**
     * The ID of the board the list belongs to.
     * 
     * @remarks
     * - Required field.
     * - Must be a string.
     */
    boardId: z.string(),
    listId: z.string(),
});

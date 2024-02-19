import { z } from 'zod';

export const UpdateList = z.object({
    title: z.string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
    }).min(3, {
        message: "Title must be at least 3 characters long"
    }), 
    id: z.string(), // The id of the board
    boardId: z.string(), // The id of the board
})
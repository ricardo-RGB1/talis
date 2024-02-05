import { z } from "zod"; 

/**
 * Represents the field errors for a given object.
 * @template T - The type of the object.
 */
export type FieldErrors<T> = {
    [K in keyof T]?: string[]; // The field errors for the given field.
}; 
// this type is used to hold validation error messages for form fields.



/**
 * Represents the state of an action.
 * @template TInput - The type of the input data.
 * @template TOutput - The type of the output data.
 */
export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>; // The field errors for the input data.
    error?: string | null; 
    data?: TOutput;
};


/**
 * Creates a safe action function that validates the input data using a schema and executes a handler function.
 * @param schema - The schema used to validate the input data.
 * @param handler - The handler function that processes the validated data and returns a promise of the action state.
 * @returns A function that accepts input data, validates it, and executes the handler function.
 */
export const createSafeAction = <TInput, TOutput>(
    // the schema that will be used to validate the input data.
    schema: z.Schema<TInput>, 
    // the handler function that will be executed if the input data is valid.
    handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>> 
) => {
    return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
        const validationResult = schema.safeParse(data); 
        if(!validationResult.success) {
            return {
                fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>,
            }
        }
        return handler(validationResult.data);
    }
}
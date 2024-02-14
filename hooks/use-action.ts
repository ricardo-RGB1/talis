import { useState, useCallback } from "react";

import { ActionState, FieldErrors } from "@/lib/create-safe-action";

/**
 * Represents an action that takes an input of type TInput and returns a Promise of type ActionState<TInput, TOutput>.
 * @template TInput The type of the input data.
 * @template TOutput The type of the output data.
 * @param data The input data for the action.
 * @returns A Promise that resolves to an ActionState object.
 */
type Action<TInput, TOutput> = (
  data: TInput
) => Promise<ActionState<TInput, TOutput>>;



/**
 * Options for the useAction hook.
 *
 * @template TOutput The type of the output data.
 */
interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

/**
 * Executes an action and returns the result.
 * @template TInput The type of the input data.
 * @template TOutput The type of the output data.
 * @param action The action to execute.
 * @param options Options for the useAction hook.
 * @returns An object containing the field errors, error, data, isLoading, and execute function.
 */
export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>, 
  options: UseActionOptions<TOutput> = {}
) => {


  
  /**
   * A custom hook that manages field errors and their state.
   *
   * @template TInput - The type of the input object.
   * @param {FieldErrors<TInput> | undefined} initialState - The initial state of the field errors.
   * @returns {[FieldErrors<TInput> | undefined, React.Dispatch<React.SetStateAction<FieldErrors<TInput> | undefined>>]} - The field errors state and its setter function.
   */
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(undefined);

  // this is the error message that will be displayed to the user if the action fails.
  const [error, setError] = useState<string | undefined>(undefined); 
  // this is the data that will be returned from the action if it succeeds.
  const [data, setData] = useState<TOutput | undefined>(undefined); 
   // this is a boolean that will be used to determine if the action is currently loading.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * Executes the action with the provided input and handles the result.
   * @param input The input for the action.
   */
  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true); 

      
      try { 
        const result = await action(input);

        // If the action returns a falsy value, return early.
        if (!result) {
          return;
        }

        // If the action returns field errors, set the fieldErrors state variable to these errors.
        setFieldErrors(result.fieldErrors); 

        // If the action returns an error, set the error state variable to this error and call the onError option with the error if it is provided.
        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }

        // If the action returns data, set the data state variable to this data and call the onSuccess option with the data if it is provided.
        if (result.data) {
          setData(result.data);
          options.onSuccess?.(result.data);
        }

      // Finally, set isLoading to false to indicate that the action has completed and call the onComplete option if it is provided.
      } finally { 
        setIsLoading(false);
        options.onComplete?.();
      }
    },
    [action, options]
  );

  return {
    fieldErrors,
    error,
    data,
    isLoading,
    execute,
  };
};

// Here's a breakdown of the code:

// useAction is a generic function with two type parameters: TInput and TOutput. It takes two arguments: action and options. action is the action to execute, and options is an optional object with options for the hook.

// The hook uses the useState hook to create state variables for fieldErrors, error, data, and isLoading. These state variables are used to store the result of the action and the loading state.

// The execute function is defined using the useCallback hook. This function is responsible for executing the action with the provided input and handling the result.

// It first sets isLoading to true to indicate that the action is loading.

// It then tries to execute the action with the provided input. If the action returns a falsy value, it returns early.

// If the action returns a result with fieldErrors, it sets the fieldErrors state variable to these errors.

// If the action returns a result with an error, it sets the error state variable to this error and calls the onError option with the error if it is provided.

// If the action returns a result with data, it sets the data state variable to this data.

// This hook can be used in a React component to execute an action and handle its result in a declarative way. The component can use the returned fieldErrors, error, data, isLoading, and execute to render its UI and trigger the action.

import { createApi } from 'unsplash-js';

/**
 * Creates an instance of the Unsplash API.
 * @param {string} accessKey - The access key for the Unsplash API.
 * @param {Function} fetch - The fetch function to be used for making HTTP requests.
 * @returns {object} - The Unsplash API instance.
 */
 export const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
    fetch: fetch // This is the fetch function that will be used for making HTTP requests.
 })  
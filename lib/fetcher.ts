
/**
 * Fetches data from the specified URL and returns the parsed JSON response.
 * @param url The URL to fetch data from.
 * @returns A Promise that resolves to the parsed JSON response.
 */
export const fetcher = (url: string) => fetch(url).then((res) => res.json());


// The fetcher function takes a string URL and returns a Promise that resolves to the parsed JSON response from the specified URL. This function is used to fetch card data from the API in the CardModal component. The fetcher function is also used in the app/api/cards/[cardId]/route.tsx file to retrieve a card from the database based on the provided cardId and orgId. The fetcher function is a common utility function that can be reused across different parts of the application to fetch data from the API. It abstracts away the details of making an HTTP request and parsing the JSON response, making it easier to fetch data from the API in different parts of the application. This helps to keep the code DRY (Don't Repeat Yourself) and makes it easier to maintain and update the code in the future.
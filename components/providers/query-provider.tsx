'use client'; 

import { useState } from "react"; 
import { QueryClient, QueryClientProvider} from "@tanstack/react-query";

/**
 * Provides a QueryClient instance to the application.
 * 
 * @param children - The child components to render.
 * @returns The QueryProvider component.
 */
export const QueryProvider = ({
    children
}: { children: React.ReactNode}) => {
    const [queryClient] = useState(() => new QueryClient()); // Create a new instance of the query client

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
}
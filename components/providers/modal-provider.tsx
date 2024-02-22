'use client'; 

import { CardModal } from "@/components/modals/card-modal";
import { useState, useEffect } from "react";

export const ModalProvider = () => {
    const [isMounted, setIsMounted ] = useState(false);

    useEffect(() => { // Set the isMounted state to true after the component mounts.
        setIsMounted(true);
    }, []);

    if(!isMounted) return null; 

    return (
        <>
            <CardModal />
        </>
    )
}
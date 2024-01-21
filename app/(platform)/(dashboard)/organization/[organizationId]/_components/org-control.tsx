'use client';

import { useEffect } from "react";
import { useParams } from 'next/navigation';
import { useOrganizationList } from "@clerk/nextjs";

/**
 * Component that sets the active organization based on the organization ID.
 */
export const OrgControl = () => {
    const params = useParams();
    const { setActive } = useOrganizationList(); 

    useEffect(() => {
        if(!setActive) return;

        setActive({ 
            organization: params.organizationId as string, // This is the organizationId from the URL parameters.
        });
    }, [setActive, params.organizationId]); 

    return null;
};

// useParams(): This is a hook from react-router-dom that returns an object of key/value pairs of URL parameters. In this case, it's being used to get the organizationId from the URL.

// useOrganizationList(): This is a custom hook (not part of React's API).

// useEffect(): it's being used to call the setActive function with an object that includes the organizationId from the URL parameters. This effect runs whenever setActive or params.organizationId changes.

// The if (!setActive) return; line inside the useEffect hook is a guard clause. It prevents the rest of the code in the hook from running if setActive is falsy (e.g., null, undefined, false, 0, NaN, or an empty string).

// The setActive function is updating the new active organization. This is the organization that will be used for all subsequent API calls.
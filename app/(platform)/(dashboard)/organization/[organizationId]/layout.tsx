import { OrgControl } from "./_components/org-control";
import { startCase } from "lodash";
import { auth } from "@clerk/nextjs";



export async function generateMetadata() {
    const { orgSlug } = auth(); // this will get the organization slug from the user's session.

    return {
        title: startCase(orgSlug || "Organization"), // this will capitalize the first letter of the orgSlug.
    }
}; 

 

const OrganizationIdLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
         <OrgControl />
        {children}
        </>
    )
}

export default OrganizationIdLayout; 
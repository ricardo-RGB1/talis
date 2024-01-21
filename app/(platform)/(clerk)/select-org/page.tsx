import { OrganizationList } from "@clerk/nextjs";

/**
 * Renders the Create Organization page.
 * @returns The JSX element representing the Create Organization page.
 */
export default function CreateOrganizationPage() {
  return (
    <OrganizationList
      hidePersonal
      afterSelectOrganizationUrl="/organization/:id"
      afterCreateOrganizationUrl="/organization/:id"
    />
  );
}
 


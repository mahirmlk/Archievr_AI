import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ResourceListClient } from "@/components/resources/resource-list-client";

export default async function ResourcesPage() {
  const session = await getSession();
  const userId = session?.user?.id ?? "";
  const resources = await prisma.resource.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Resource Manager</h2>
      <ResourceListClient initialResources={resources} />
    </div>
  );
}

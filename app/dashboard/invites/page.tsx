import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { inviteService } from "@/lib/services/invite-service"
import { InvitesClientComponent } from "@/components/dashboard/invites/invites-client-component"
import { getInvites, getInvitesByStatus } from "@/lib/actions/invite-actions"

export const metadata = {
  title: "Invites | Dashboard",
}

export const dynamic = "force-dynamic"


export default async function InvitesPage(context: {
  searchParams: Promise<{ page?: string; limit?: string; }>;
}) {
  const param = await context.searchParams;

  const page = param.page ? Number.parseInt(param.page) : 1;
  const limit = param.limit ? Number.parseInt(param.limit) : 10;

  const { data, meta } = await getInvites({ page, limit, type: "INVITE" });

  const { stats } = await getInvitesByStatus(undefined, "INVITE");
  const countries = await inviteService.getCountries();

  return (
    <div className="space-y-4 md:space-y-6">
      <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
        <InvitesClientComponent
          initialInvites={data ?? []}
          initialStats={stats as any}
          countries={countries}
          meta={meta}
        />
      </Suspense>
    </div>
  );
}

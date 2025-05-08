import ClientsList from "@/components/dashboard/clients/clients-list"
import { clientService } from "@/lib/services/client-service"

export default async function ClientsPage({ searchParams }: { searchParams: { page?: string, limit?: string } }) {
  const resolvedParams = await searchParams
  // get searchparams from URL
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
  const limit = resolvedParams.limit ? parseInt(resolvedParams.limit) : 10

  // fetch data from service client
  const { data: clients, meta } = await clientService.getClients(page, limit)

  return (
    <div className="mx-auto px-2 py-8">
      <h1 className="text-2xl font-bold mb-6">Clients</h1>
      <ClientsList clients={clients} pagination={meta} />
    </div>
  )

}
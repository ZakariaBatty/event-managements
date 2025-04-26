import { clientRepository } from '../repositories/client-repository';

export const clientService = {
   async getClients(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
         clientRepository.findAllWithRelations({
            skip,
            take: limit,
            orderBy: {
               createdAt: 'desc',
            },
         }),
         clientRepository.count(),
      ]);

      const clientsWithEventCount = data.reduce((acc: any[], contact: any) => {
         const existing = acc.find((c) => c.id === contact.id);

         if (existing) {
            // same contact appeared again (due to multiple eventId)
            if (contact.eventId) existing.eventCount += 1;
         } else {
            acc.push({
               ...contact,
               eventCount: contact.eventId ? 1 : 0,
            });
         }

         return acc;
      }, []);

      return {
         data: clientsWithEventCount,
         meta: {
            total,
            page,
            limit,
            pageCount: Math.ceil(total / limit),
         },
      };
   },

   async getClient(id: string) {
      return clientRepository.findWithInvoices(id);
   },

   async createClient(data: any) {
      return clientRepository.create(data);
   },

   async updateClient(id: string, data: any) {
      return clientRepository.update(id, data);
   },

   async deleteClient(id: string) {
      return clientRepository.delete(id);
   },
};

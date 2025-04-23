import { clientRepository } from '../repositories/client-repository';

export const clientService = {
   async getClients(page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
         clientRepository.findAllWithRelations(),
         clientRepository.count(),
      ]);

      return {
         data,
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

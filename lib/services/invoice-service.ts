import { invoiceRepository } from '../repositories/invoice-repository';

export const invoiceService = {
   async getInvoices(page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
         invoiceRepository.findAllWithRelations({
            skip,
            take: limit,
            orderBy: {
               createdAt: 'desc',
            },
         }),
         invoiceRepository.count(),
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

   async getInvoice(id: string) {
      return invoiceRepository.findById(id);
   },

   async getInvoicesByClient(clientId: string) {
      return invoiceRepository.findByClient(clientId);
   },

   async getInvoicesByEvent(eventId: string) {
      return invoiceRepository.findByEvent(eventId);
   },

   async createInvoice(data: any) {
      return invoiceRepository.create({
         number: data.number,
         amount: data.amount,
         status: data.status,
         dueDate: new Date(data.dueDate),
         client: {
            connect: {
               id: data.clientId,
            },
         },
         event: {
            connect: {
               id: data.eventId,
            },
         },
      });
   },

   async updateInvoice(id: string, data: any) {
      const updateData: any = {
         number: data.number,
         amount: data.amount,
         status: data.status,
         dueDate: new Date(data.dueDate),
      };

      // Handle client relationship if provided
      if (data.clientId) {
         updateData.client = {
            connect: {
               id: data.clientId,
            },
         };
      }

      // Handle event relationship if provided
      if (data.eventId) {
         updateData.event = {
            connect: {
               id: data.eventId,
            },
         };
      }

      return invoiceRepository.update(id, updateData);
   },

   async deleteInvoice(id: string) {
      return invoiceRepository.delete(id);
   },
};

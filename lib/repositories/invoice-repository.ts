import prisma from '@/lib/db';

import { Invoice, Prisma } from '@prisma/client';
import { createRepository } from './base-repository';

// Create base repository functions
const baseRepository = createRepository<Invoice>(prisma.invoice);

export const invoiceRepository = {
   ...baseRepository,

   async findAllWithRelations(options?: Prisma.InvoiceFindManyArgs) {
      return prisma.invoice.findMany({
         ...options,
         include: {
            contact: true,
            event: true,
         },
      });
   },

   async findByClient(contactId: string) {
      return prisma.invoice.findMany({
         where: { contactId },
         include: {
            event: true,
         },
         orderBy: {
            createdAt: 'desc',
         },
      });
   },

   async findByEvent(eventId: string) {
      return prisma.invoice.findMany({
         where: { eventId },
         include: {
            contact: true,
         },
         orderBy: {
            createdAt: 'desc',
         },
      });
   },
};

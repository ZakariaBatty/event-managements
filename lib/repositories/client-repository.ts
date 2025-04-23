import prisma from '@/lib/db';
import type { Client } from '@prisma/client';
import { createRepository } from '../repositories/base-repository';

// Create base repository functions
const baseRepository = createRepository<Client>(prisma.client);

// Extended client repository with custom functions
export const clientRepository = {
   ...baseRepository,

   async findWithInvoices(id: string) {
      return prisma.client.findUnique({
         where: { id },
         include: {
            invoices: true,
            events: true,
         },
      });
   },

   async findAllWithRelations() {
      return prisma.client.findMany({
         include: {
            _count: {
               select: {
                  invoices: true,
                  events: true,
               },
            },
         },
      });
   },
};

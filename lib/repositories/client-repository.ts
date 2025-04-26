import prisma from '@/lib/db';
import { createRepository } from '../repositories/base-repository';
import { Contact } from '@prisma/client';

// Create base repository functions
const baseRepository = createRepository<Contact>(prisma.contact);

// Extended client repository with custom functions
export const clientRepository = {
   ...baseRepository,

   async findWithInvoices(id: string) {
      return prisma.contact.findUnique({
         where: { id },
         include: {
            invoices: true,
         },
      });
   },

   async findAllWithRelations(options: any = {}) {
      return prisma.contact.findMany({
         ...options,
         where: { type: 'CLIENT' },
         include: {
            _count: {
               select: {
                  invoices: true,
               },
            },
         },
      });
   },
};

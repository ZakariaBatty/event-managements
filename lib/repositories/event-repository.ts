import prisma from '@/lib/db';
import { createRepository } from './base-repository';
import type { Event } from '@prisma/client';
// Create base repository functions
const baseRepository = createRepository<Event>(prisma.event);

// Extended event repository with custom functions
export const eventRepository = {
   ...baseRepository,

   async findWithDetails(id: string) {
      return prisma.event.findUnique({
         where: { id },
         include: {
            _count: {
               select: {
                  sideEventItem: true,
                  speakers: true,
                  contacts: true,
               },
            },
            sideEventItem: {
               include: {
                  speakers: true,
               },
            },
            qrCodes: true,
            invoices: {
               include: {
                  contact: true, // no where allowed here
               },
            },
            contacts: {
               where: {
                  type: { in: ['CLIENT', 'INVITE', 'PARTNER'] },
               },
               include: {
                  country: true,
               },
            },
         },
      });
   },

   async findAllWithStats(options: any = {}) {
      return await prisma.event.findMany({
         ...options,
         include: {
            _count: {
               select: {
                  sideEventItem: true,
                  speakers: true,
                  contacts: true,
               },
            },
            contacts: {
               select: {
                  type: true,
               },
            },
         },
      });
   },

   async getUpcomingEvents(limit = 5) {
      const now = new Date();
      return await prisma.event.findMany({
         where: {
            startDate: {
               gte: now,
            },
         },
         include: {
            contacts: {
               select: {
                  type: true,
               },
            },
         },
         orderBy: {
            startDate: 'asc',
         },
         take: limit,
      });
   },
};

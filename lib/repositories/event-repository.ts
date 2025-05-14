import prisma from '@/lib/db';
import { createRepository } from './base-repository';
import { endOfDay, startOfDay } from 'date-fns';
// Create base repository functions
const baseRepository = createRepository(prisma.event);

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
            speakers: {
               include: {
                  _count: {
                     select: {
                        sideEventItem: true,
                     },
                  },
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
                  type: { in: ['INVITE'] },
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
               gte: now, // >= now
            },
            // endDate: {
            //    lte: now, // <= now
            // },
            status: {
               in: ['ACTIVE', 'UPCOMING'],
            },
            contacts: {
               some: {
                  type: {
                     in: ['INVITE'],
                  },
               },
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

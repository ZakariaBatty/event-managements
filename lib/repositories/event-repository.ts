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
            sideEventItem: {
               include: {
                  speakers: true,
               },
            },
            partners: true,
            qrCodes: true,
            clients: true,
            invites: {
               include: {
                  country: true,
               },
            },
            invoices: {
               include: {
                  client: true,
               },
            },
         },
      });
   },

   async findAllWithStats(options: any = {}) {
      const events = await prisma.event.findMany({
         ...options,
         include: {
            _count: {
               select: {
                  sideEventItem: true,
                  speakers: true,
                  partners: true,
                  invites: true,
               },
            },
         },
      });

      return events.map((event: any) => ({
         ...event,
         statistics: {
            sessions: event._count.sideEventItems,
            speakers: event._count.speakers,
            partners: event._count.partners,
            registrations: event._count.invites,
         },
      }));
   },

   async getUpcomingEvents(limit = 5) {
      const now = new Date();
      return prisma.event.findMany({
         where: {
            startDate: {
               gte: now,
            },
         },
         include: {
            _count: {
               select: {
                  invites: true,
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

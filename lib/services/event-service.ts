import { eventRepository } from '../repositories/event-repository';
import { sideEventItemRepository } from '../repositories/base-repository';
import { speakerRepository } from '../repositories/base-repository';

export const eventService = {
   async getEvents(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const [events, total] = await Promise.all([
         eventRepository.findAllWithStats({
            skip,
            take: limit,
            orderBy: {
               startDate: 'desc',
            },
         }),
         eventRepository.count(),
      ]);

      const data = events.map((event: any) => {
         const counts = {
            CLIENT: 0,
            INVITE: 0,
            PARTNER: 0,
         };

         event.contacts.forEach((c: { type: keyof typeof counts }) => {
            if (counts[c.type] !== undefined) {
               counts[c.type]++;
            }
         });

         return {
            ...event,
            statistics: {
               sessions: event._count.sideEventItem,
               speakers: event._count.speakers,
               partners: counts.PARTNER,
               registrations: counts.INVITE,
               clients: counts.CLIENT,
            },
         };
      });

      const meta = {
         total,
         page,
         limit,
         pageCount: Math.ceil(total / limit),
      };

      return { data, meta };
   },

   async getEvent(id: string) {
      return eventRepository.findWithDetails(id);
   },

   async getUpcomingEvents(page = 1, limit = 5) {
      const skip = (page - 1) * limit;
      const [events, total] = await Promise.all([
         eventRepository.getUpcomingEvents(limit),
         eventRepository.count({
            startDate: {
               gte: new Date(),
            },
         }),
      ]);

      const data = events.map((event: any) => {
         const inviteCount = event.contacts.filter(
            (c: { type: string }) => c.type === 'INVITE'
         ).length;

         return {
            ...event,
            inviteCount,
         };
      });

      const meta = {
         total,
         page,
         limit,
         pageCount: Math.ceil(total / limit),
      };

      return { data, meta };
   },

   async createEvent(data: any) {
      return eventRepository.create(data);
   },

   async updateEvent(id: string, data: any) {
      return eventRepository.update(id, data);
   },

   async deleteEvent(id: string) {
      return eventRepository.delete(id);
   },

   async getEventSessions(eventId: string) {
      return sideEventItemRepository.findAll({
         where: { eventId },
         include: {
            speakers: true,
            day: true,
         },
         orderBy: {
            day: {
               date: 'asc',
            },
         },
      });
   },

   async getEventSpeakers(eventId: string) {
      return speakerRepository.findAll({
         where: {
            item: {
               eventId,
            },
         },
      });
   },
};

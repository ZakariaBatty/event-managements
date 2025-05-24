import { eventRepository } from '../repositories/event-repository';
import { sideEventItemRepository } from '../repositories/base-repository';
import { speakerRepository } from '../repositories/base-repository';
import { normalizeDateToISODateOnly } from '../utils';

export const eventService = {
   async getEvents(page = 1, limit = 10) {
      const skip = (page - 1) * limit;

      const [events, total] = await Promise.all([
         eventRepository.findAllWithStats({
            skip,
            take: limit,
            orderBy: {
               startDate: 'asc',
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

         event.contacts
            .filter((c: any) =>
               ['INVITE', 'PARTNER', 'SPONSOR'].includes(c.type)
            )
            .forEach((c: { type: keyof typeof counts }) => {
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
      const event = await eventRepository.findWithDetails(id);

      if (!event) {
         return { data: null };
      }

      const counts = {
         SPONSOR: 0,
         INVITE: 0,
         PARTNER: 0,
      };

      // const partners = event.contacts.filter((c: any) => c.type === 'PARTNER');
      // const sponsors = event.contacts.filter((c: any) => c.type === 'SPONSOR');
      const invites = event.contacts.filter((c: any) => c.type === 'INVITE');

      event.contacts.forEach((c: any) => {
         if (['INVITE', 'PARTNER', 'SPONSOR'].includes(c.type)) {
            counts[c.type as keyof typeof counts]++;
         }
      });

      return {
         id: event.id,
         title: event.title,
         coverImage: event.coverImage,
         logo: event.logo,
         status: event.status,
         description: event.description,
         organizers: event.organizers,
         Goals: event.Goals,
         Themes: event.Themes,
         startDate: event.startDate,
         endDate: event.endDate,
         location: event.location,
         qrCodes: event.qrCodes,
         invoices: event.invoices,
         // partners,
         // sponsors,
         invites,
         sessions: event.sideEventItem,
         speakers: event.speakers,
         statistics: {
            sessions: event._count.sideEventItem,
            speakers: event._count.speakers,
            partners: counts.PARTNER,
            registrations: counts.INVITE,
            sponsors: counts.SPONSOR,
         },
      };
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

   async eventsList() {
      const today = new Date(normalizeDateToISODateOnly(new Date()));
      return eventRepository.findAll({
         where: {
            endDate: {
               gte: today,
            },
         },
         orderBy: {
            createdAt: 'asc',
         },
         select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
         },
      });
   },
};

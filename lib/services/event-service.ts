import { eventRepository } from '../repositories/event-repository';
import { sideEventItemRepository } from '../repositories/base-repository';
import { speakerRepository } from '../repositories/base-repository';

export const eventService = {
   async getEvents(page = 1, limit = 10) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
         eventRepository.findAllWithStats({
            skip,
            take: limit,
            orderBy: {
               startDate: 'desc',
            },
         }),
         eventRepository.count(),
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

   async getEvent(id: string) {
      return eventRepository.findWithDetails(id);
   },

   async getUpcomingEvents(page = 1, limit = 5) {
      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
         eventRepository.getUpcomingEvents(limit),
         eventRepository.count({
            startDate: {
               gte: new Date(),
            },
         }),
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

import prisma from '@/lib/db';
import type { ContactStatus, ContactType, Prisma } from '@prisma/client';

export const inviteRepository = {
   async findAll(options?: Prisma.ContactFindManyArgs) {
      return prisma.contact.findMany(options);
   },

   async findById(id: string) {
      return prisma.contact.findUnique({
         where: { id },
         include: {
            events: true,
            country: true,
         },
      });
   },

   async create(data: Prisma.ContactCreateInput) {
      return prisma.contact.create({ data });
   },

   async update(id: string, data: Prisma.ContactUpdateInput) {
      return prisma.contact.update({
         where: { id },
         data,
      });
   },

   async delete(id: string) {
      return prisma.contact.delete({
         where: { id },
      });
   },

   async count(where?: Prisma.ContactWhereInput) {
      return prisma.contact.count({ where });
   },

   async getInvitesByEvent(eventId: string, type?: string) {
      const whereClause: Prisma.ContactWhereInput = { eventId };

      if (type) {
         whereClause.type = type as ContactType;
      }

      return prisma.contact.findMany({
         where: whereClause,
         include: {
            country: true,
            events: true,
         },
      });
   },

   async getInvitesByType(type: ContactType) {
      return prisma.contact.findMany({
         where: { type },
         include: {
            country: true,
            events: true,
         },
      });
   },

   async getInviteStats(eventId?: string, type?: ContactType) {
      const whereClause: Prisma.ContactWhereInput = {};

      if (eventId) {
         whereClause.eventId = eventId;
      }

      if (type) {
         whereClause.type = type;
      }

      const [total, confirmed, pending, declined] = await Promise.all([
         prisma.contact.count({ where: whereClause }),
         prisma.contact.count({
            where: { ...whereClause, status: 'confirmed' as ContactStatus },
         }),
         prisma.contact.count({
            where: { ...whereClause, status: 'pending' as ContactStatus },
         }),
         prisma.contact.count({
            where: { ...whereClause, status: 'declined' as ContactStatus },
         }),
      ]);

      // Get country stats
      const countryStats = await prisma.contact.groupBy({
         by: ['countryId'],
         where: whereClause,
         _count: true,
      });

      // Get domain stats
      const domainStats = await prisma.contact.groupBy({
         by: ['tier'],
         where: whereClause,
         _count: true,
      });

      // Get type stats
      const typeStats = await prisma.contact.groupBy({
         by: ['type'],
         _count: true,
      });

      // Get event stats if no specific event is requested
      let eventStats = [] as any;
      if (!eventId) {
         eventStats = await prisma.contact.groupBy({
            by: ['eventId'],
            _count: true,
         });
      }

      return {
         totalInvites: total,
         confirmedInvites: confirmed,
         pendingInvites: pending,
         declinedInvites: declined,
         countryStats,
         domainStats,
         typeStats,
         eventStats,
      };
   },
};

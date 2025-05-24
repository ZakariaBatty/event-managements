import { countryRepository } from '../repositories/country-repository';
import { inviteRepository } from '../repositories/invite-repository';

export const inviteService = {
   async getInvites(page: number, limit: number, filters = {}) {
      const { type, ...otherFilters } = filters as any;
      const whereClause: any = { ...otherFilters };
      console.log('pag', page, limit, type);
      if (type) {
         whereClause.type = type;
      }
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
         inviteRepository.findAll({
            skip,
            take: limit,
            where: whereClause,
            include: {
               country: true,
               events: true,
            },
            orderBy: {
               createdAt: 'desc',
            },
         }),
         inviteRepository.count(whereClause),
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

   async getInvitesByType(type: string, page = 1, limit = 10, filters = {}) {
      const whereClause: any = { type, ...filters };

      const skip = (page - 1) * limit;
      const [data, total] = await Promise.all([
         inviteRepository.findAll({
            skip,
            take: limit,
            where: whereClause,
            include: {
               country: true,
               events: true,
            },
            orderBy: {
               createdAt: 'desc',
            },
         }),
         inviteRepository.count(whereClause),
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

   async getInvite(id: string) {
      return inviteRepository.findById(id);
   },

   async getInvitesByEvent(eventId: string, type?: string) {
      return inviteRepository.getInvitesByEvent(eventId, type);
   },

   async getInviteStats(eventId?: string, type?: any) {
      return inviteRepository.getInviteStats(eventId, type);
   },

   async createInvite(data: any) {
      // Handle country relationship
      let countryId = data.countryId;

      // If country name is provided but not ID, find or create the country
      if (data.country && !countryId) {
         const country = await countryRepository.findOrCreate(data.country);
         countryId = country.id;
      }

      // Create the invite with proper relationships
      return inviteRepository.create({
         name: data.name,
         email: data.email,
         phone: data.phone,
         notes: data.notes,
         domain: data.domain,
         type: data.type || 'INVITE',
         status: data.status || 'ACCEPTED',
         events: {
            connect: {
               id: data.eventId,
            },
         },
         country: data.countryId
            ? {
                 connect: {
                    id: countryId,
                 },
              }
            : undefined,
      });
   },

   async updateInvite(id: string, data: any) {
      // Handle country relationship
      let countryUpdate = {};
      let eventUpdate = {};

      if (data.countryId) {
         countryUpdate = {
            country: {
               connect: {
                  id: data.countryId,
               },
            },
         };
      }

      if (data.eventId) {
         eventUpdate = {
            events: {
               connect: {
                  id: data.eventId,
               },
            },
         };
      }

      // Remove raw foreign keys from main data object
      delete data.countryId;
      delete data.eventId;

      // Update the invite
      return inviteRepository.update(id, {
         ...data,
         ...countryUpdate,
         ...eventUpdate,
      });
   },

   async deleteInvite(id: string) {
      return inviteRepository.delete(id);
   },

   async getCountries() {
      return countryRepository.findAll({
         orderBy: {
            name: 'desc',
         },
      });
   },
};

import { countryRepository } from '../repositories/country-repository';
import { inviteRepository } from '../repositories/invite-repository';

export const inviteService = {
   async getInvites(page = 1, limit = 10, filters = {}) {
      console.log('Fetching invites with filters:', filters);
      const { type, ...otherFilters } = filters as any;
      const whereClause: any = { ...otherFilters };

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
               createdAt: 'asc',
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
         address: data.address,
         notes: data.notes,
         position: data.position,
         domain: data.domain,
         type: data.type || 'INVITE',
         status: data.status || 'PENDING',
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

      if (data.countryId) {
         countryUpdate = {
            country: {
               connect: {
                  id: data.countryId,
               },
            },
         };
      } else if (data.country) {
         const country = await countryRepository.findOrCreate(data.country);
         countryUpdate = {
            country: {
               connect: {
                  id: country.id,
               },
            },
         };
      }

      // Handle date fields
      // const dateFields = {};
      // if (data.arrivalDate) {
      //    dateFields['arrivalDate'] = new Date(data.arrivalDate);
      // }
      // if (data.departureDate) {
      //    dateFields['departureDate'] = new Date(data.departureDate);
      // }

      // Update the invite
      return inviteRepository.update(id, {
         ...data,
         //  ...dateFields,
         ...countryUpdate,
      });
   },

   async deleteInvite(id: string) {
      return inviteRepository.delete(id);
   },

   async getCountries() {
      return countryRepository.findAll({
         orderBy: {
            name: 'asc',
         },
      });
   },
};

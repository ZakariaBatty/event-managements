import type { Prisma } from '@prisma/client';
import { speakerRepository } from '../repositories/speaker-repository';

export const speakerService = {
   async getSpeakers(page = 1, limit = 10, search = '') {
      const skip = (page - 1) * limit;
      const where: Prisma.SpeakerWhereInput = {};

      // Add search filter if provided
      if (search) {
         where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { organization: { contains: search, mode: 'insensitive' } },
         ];
      }

      // Fetch speakers and total count in parallel
      const [speakers, total] = await Promise.all([
         speakerRepository.findAll({
            where,
            skip,
            take: limit,
            orderBy: { name: 'asc' },
         }),
         speakerRepository.count(where),
      ]);

      return {
         data: speakers,
         meta: {
            total,
            page,
            limit,
            pageCount: Math.ceil(total / limit),
         },
      };
   },

   async getSpeakerById(id: string) {
      return speakerRepository.findById(id);
   },

   async createSpeaker(data: any) {
      return speakerRepository.create(data);
   },

   async updateSpeaker(id: string, data: any) {
      return speakerRepository.update(id, data);
   },

   async deleteSpeaker(id: string) {
      return speakerRepository.delete(id);
   },

   async getSpeakersByEvent(eventId: string) {
      return speakerRepository.findByEvent(eventId);
   },
};

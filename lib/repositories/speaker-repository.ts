import prisma from '@/lib/db';
import type { Prisma } from '@prisma/client';

export const speakerRepository = {
   async findAll(options?: Prisma.SpeakerFindManyArgs) {
      return prisma.speaker.findMany(options);
   },

   async findById(id: string) {
      return prisma.speaker.findUnique({
         where: { id },
         include: {
            events: true,
            sideEventItem: true,
         },
      });
   },

   async create(data: Prisma.SpeakerCreateInput) {
      return prisma.speaker.create({
         data,
         include: {
            events: true,
         },
      });
   },

   async update(id: string, data: Prisma.SpeakerUpdateInput) {
      return prisma.speaker.update({
         where: { id },
         data,
         include: {
            events: true,
         },
      });
   },

   async delete(id: string) {
      return prisma.speaker.delete({
         where: { id },
      });
   },

   async count(where?: Prisma.SpeakerWhereInput) {
      return prisma.speaker.count({ where });
   },

   async findSpeakersWithItemsByEvent(eventId: string) {
      return prisma.speaker.findMany({
         where: {
            events: {
               some: {
                  id: eventId,
               },
            },
         },
         include: {
            sideEventItem: true,
         },
      });
   },

   async findByEvent(eventId: string) {
      return prisma.speaker.findMany({
         where: {
            events: {
               some: {
                  id: eventId,
               },
            },
         },
      });
   },
};

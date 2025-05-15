import prisma from '@/lib/db';
import type { Prisma } from '@prisma/client';

export const sideEventItemRepository = {
   async findAll(options?: Prisma.SideEventItemFindManyArgs) {
      return prisma.sideEventItem.findMany(options);
   },

   async findById(id: string) {
      return prisma.sideEventItem.findUnique({
         where: { id },
         include: {
            event: true,
            speakers: true,
         },
      });
   },

   async create(data: Prisma.SideEventItemCreateInput) {
      return prisma.sideEventItem.create({
         data,
         include: {
            speakers: true,
         },
      });
   },

   async update(id: string, data: Prisma.SideEventItemUpdateInput) {
      return prisma.sideEventItem.update({
         where: { id },
         data,
         include: {
            speakers: true,
         },
      });
   },

   async delete(id: string) {
      return prisma.sideEventItem.delete({
         where: { id },
      });
   },

   async count(where?: Prisma.SideEventItemWhereInput) {
      return prisma.sideEventItem.count({ where });
   },

   async findByEvent(eventId: string) {
      return prisma.sideEventItem.findMany({
         where: { eventId },
         include: {
            speakers: true,
         },
         orderBy: {
            date: 'asc',
         },
      });
   },
};

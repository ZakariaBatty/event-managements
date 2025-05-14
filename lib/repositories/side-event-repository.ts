import prisma from '@/lib/db';
import { SideEventItem } from '@prisma/client';
import { createRepository } from './base-repository';

const baseRepository = createRepository<SideEventItem>(prisma.sideEventItem);
// This file is part of the Side Event Management System.
export const sideEventItemRepository = {
   ...baseRepository,
};

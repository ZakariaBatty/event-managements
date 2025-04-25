import prisma from '@/lib/db';

// Generic repository functions with common CRUD operations
export function createRepository<T>(model: any) {
   return {
      async findAll(options: any = {}): Promise<T[]> {
         try {
            return await model.findMany(options);
         } catch (error) {
            console.error(`Error finding all in ${model}:`, error);
            throw error;
         }
      },

      async findById(id: string, options: any = {}): Promise<T | null> {
         try {
            return await model.findUnique({
               where: { id },
               ...options,
            });
         } catch (error) {
            console.error(`Error finding by id ${id} in ${model}:`, error);
            throw error;
         }
      },

      async create(data: any): Promise<T> {
         try {
            return await model.create({
               data,
            });
         } catch (error) {
            console.error(`Error creating in ${model}:`, error);
            throw error;
         }
      },

      async update(id: string, data: any): Promise<T> {
         try {
            return await model.update({
               where: { id },
               data,
            });
         } catch (error) {
            console.error(`Error updating id ${id} in ${model}:`, error);
            throw error;
         }
      },

      async delete(id: string): Promise<T> {
         try {
            return await model.delete({
               where: { id },
            });
         } catch (error) {
            console.error(`Error deleting id ${id} in ${model}:`, error);
            throw error;
         }
      },

      async count(where: any = {}): Promise<number> {
         try {
            return await model.count({ where });
         } catch (error) {
            console.error(`Error counting in ${model}:`, error);
            throw error;
         }
      },
   };
}

// Export repository instances for each model
export const eventRepository = createRepository(prisma.event);
export const userRepository = createRepository(prisma.user);
export const clientRepository = createRepository(prisma.contact);
export const speakerRepository = createRepository(prisma.speaker);
export const invoiceRepository = createRepository(prisma.invoice);
export const qrCodeRepository = createRepository(prisma.qRCode);
export const sideEventItemRepository = createRepository(prisma.sideEventItem);
// export const sideEventDayRepository = createRepository(prisma.sideEventDay);

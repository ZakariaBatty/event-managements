import prisma from '@/lib/db';
import type { Country, Prisma } from '@prisma/client';

export const countryRepository = {
   async findAll(options?: Prisma.CountryFindManyArgs): Promise<Country[]> {
      try {
         return await prisma.country.findMany(options);
      } catch (error) {
         console.error('Error finding countries:', error);
         throw error;
      }
   },

   async findById(id: string): Promise<Country | null> {
      try {
         return await prisma.country.findUnique({
            where: { id },
         });
      } catch (error) {
         console.error(`Error finding country with id ${id}:`, error);
         throw error;
      }
   },

   async findByName(name: string): Promise<Country | null> {
      try {
         return await prisma.country.findUnique({
            where: { name },
         });
      } catch (error) {
         console.error(`Error finding country with name ${name}:`, error);
         throw error;
      }
   },

   async create(data: Prisma.CountryCreateInput): Promise<Country> {
      try {
         return await prisma.country.create({ data });
      } catch (error) {
         console.error('Error creating country:', error);
         throw error;
      }
   },

   async update(id: string, data: Prisma.CountryUpdateInput): Promise<Country> {
      try {
         return await prisma.country.update({
            where: { id },
            data,
         });
      } catch (error) {
         console.error(`Error updating country with id ${id}:`, error);
         throw error;
      }
   },

   async delete(id: string): Promise<Country> {
      try {
         return await prisma.country.delete({
            where: { id },
         });
      } catch (error) {
         console.error(`Error deleting country with id ${id}:`, error);
         throw error;
      }
   },

   async count(where?: Prisma.CountryWhereInput): Promise<number> {
      try {
         return await prisma.country.count({ where });
      } catch (error) {
         console.error('Error counting countries:', error);
         throw error;
      }
   },

   async findOrCreate(name: string): Promise<Country> {
      try {
         const country = await this.findByName(name);
         if (country) {
            return country;
         }

         return await this.create({ name, code: 'DEFAULT_CODE' });
      } catch (error) {
         console.error(
            `Error finding or creating country with name ${name}:`,
            error
         );
         throw error;
      }
   },
};

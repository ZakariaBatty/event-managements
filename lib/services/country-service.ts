import { countryRepository } from '../repositories/country-repository';

export const countryService = {
   async getCountries() {
      return await countryRepository.findAll();
   },

   async getCountryById(id: string) {
      return await countryRepository.findById(id);
   },

   async getCountryByName(name: string) {
      return await countryRepository.findByName(name);
   },

   async createCountry(data: any) {
      return await countryRepository.create(data);
   },

   async updateCountry(id: string, data: any) {
      return await countryRepository.update(id, data);
   },

   async deleteCountry(id: string) {
      return await countryRepository.delete(id);
   },
};

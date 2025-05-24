'use server';

import { countryService } from '../services/country-service';

export async function getCountriesAction() {
   const countries = await countryService.getCountries();
   return countries;
}

export async function getCountryByIdAction(id: string) {
   const country = await countryService.getCountryById(id);
   return country;
}

export async function getCountryByNameAction(name: string) {
   const country = await countryService.getCountryByName(name);
   return country;
}

export async function createCountryAction(data: any) {
   try {
      const country = await countryService.createCountry(data);
      return { success: true, data: country };
   } catch (error) {
      console.error('Failed to create country:', error);
      return { success: false, error: 'Failed to create country' };
   }
}

export async function updateCountryAction(id: string, data: any) {
   try {
      const country = await countryService.updateCountry(id, data);
      return { success: true, data: country };
   } catch (error) {
      console.error('Failed to update country:', error);
      return { success: false, error: 'Failed to update country' };
   }
}

export async function deleteCountryAction(id: string) {
   try {
      await countryService.deleteCountry(id);
      return { success: true };
   } catch (error) {
      console.error('Failed to delete country:', error);
      return { success: false, error: 'Failed to delete country' };
   }
}

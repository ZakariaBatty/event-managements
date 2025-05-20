'use server';

import { z } from 'zod';
import { sessionSchema, type SessionFormData } from '../schemas';
import { programmeService } from '../services/programme-service';
import { revalidatePath } from 'next/cache';
import { normalizeDateToISODateOnly } from '../utils';

export async function createSideEventItem(
   formData: FormData | SessionFormData
) {
   try {
      let data: SessionFormData;
      // Check type formaData
      if (formData instanceof FormData) {
         // Extract the values from the FormData object
         data = {
            title: formData.get('title') as string,
            date: new Date(
               normalizeDateToISODateOnly(formData.get('date') as string)
            ),
            time: formData.get('time') as string,
            type: formData.get('type') as string,
            description: (formData.get('description') as string) || '',
            location: (formData.get('location') as string) || '',
            eventId: formData.get('eventId') as string,
            speakerIds: formData.get('speakers')
               ? (formData.get('speakers') as string)
                    .split(',')
                    .map((id) => id.trim())
               : [],
         };
      } else {
         // Direct object passing
         data = formData;
      }

      // Validate with Zod
      try {
         sessionSchema.parse(data);
      } catch (validationError) {
         if (validationError instanceof z.ZodError) {
            const errors = validationError.errors
               .map((err) => `${err.path.join('.')}: ${err.message}`)
               .join(', ');
            return { success: false, error: `Validation failed: ${errors}` };
         }
         return { success: false, error: 'Validation failed' };
      }

      //  call service to create the item
      const result = await programmeService.createProgrammeItem(data);
      revalidatePath(`/dashboard/events/${data.eventId}/details`);

      return { success: true, data: result };
   } catch (error) {
      console.error('Error creating side event item:', error);
      return { success: false, error: 'Failed to create side event item' };
   }
}

export async function updateSideEventItem(
   id: string,
   formData: FormData | Partial<SessionFormData>
) {
   try {
      let data: Partial<SessionFormData>;

      if (formData instanceof FormData) {
         // Extract data from FormData
         data = {
            title: formData.get('title') as string,
            date: formData.has('date')
               ? new Date(formData.get('date') as string)
               : undefined,
            time: formData.get('time') as string,
            type: formData.get('type') as string,
            description: (formData.get('description') as string) || '',
            location: (formData.get('location') as string) || '',
            speakerIds: (() => {
               const raw = formData.get('speakers') as string | null;
               if (!raw || raw.trim() === '') return [];
               return raw
                  .split(',')
                  .map((id) => id.trim())
                  .filter((id) => id !== '');
            })(),
         };
      } else {
         // Direct object passing
         data = formData;
      }

      // Call service to update the item
      const result = await programmeService.updateProgrammeItem(id, data);

      // Get the event ID for revalidation
      const item = await programmeService.getProgrammeItem(id);
      if (item) {
         revalidatePath(`/dashboard/events/${item.eventId}/details`, 'page');
      }

      return { success: true, data: result };
   } catch (error) {
      console.error('Error updating side event item:', error);
      return { success: false, error: 'Failed to update side event item' };
   }
}

export async function deleteSideEventItem(id: string) {
   try {
      // Get the item first to get the event ID for revalidation
      const item = await programmeService.getProgrammeItem(id);

      // Delete the item
      const result = await programmeService.deleteProgrammeItem(id);

      // Revalidate paths
      if (item) {
         revalidatePath(`/dashboard/events/${item.eventId}/details`);
      }

      return { success: true, data: result };
   } catch (error) {
      console.error('Error deleting side event item:', error);
      return { success: false, error: 'Failed to delete side event item' };
   }
}

export async function getProgramme(eventId: string) {
   try {
      const programme = await programmeService.getProgramme(eventId);
      return { success: true, data: programme };
   } catch (error) {
      console.error('Error getting programme:', error);
      return { success: false, error: 'Failed to get programme' };
   }
}

export async function getProgrammeItem(id: string) {
   try {
      const item = await programmeService.getProgrammeItem(id);
      return { success: true, data: item };
   } catch (error) {
      console.error('Error getting programme item:', error);
      return { success: false, error: 'Failed to get programme item' };
   }
}

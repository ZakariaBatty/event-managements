'use server';

import { revalidatePath } from 'next/cache';
import { speakerService } from '../services/speaker-service';
import { speakerSchema, type SpeakerFormData } from '../schemas';
import { z } from 'zod';

// Helper function to handle validation and return a consistent response format
async function validateAndExecute<T extends z.ZodSchema, U>(
   schema: T,
   data: z.infer<T>,
   action: (validData: z.infer<T>) => Promise<U>
) {
   try {
      // Validate the data with Zod
      const validData = schema.parse(data);

      // Execute the action with validated data
      const result = await action(validData);

      return { success: true, data: result };
   } catch (error) {
      console.error('Validation or execution error:', error);

      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
         const fieldErrors = error.errors.reduce((acc, curr) => {
            const path = curr.path.join('.');
            acc[path] = curr.message;
            return acc;
         }, {} as Record<string, string>);

         return {
            success: false,
            error: 'Validation failed',
            fieldErrors,
         };
      }

      return { success: false, error: 'Failed to process request' };
   }
}

// Updated to accept a typed object directly
export async function createSpeaker(data: SpeakerFormData) {
   return validateAndExecute(speakerSchema, data, async (validData) => {
      const speaker = await speakerService.createSpeaker({
         name: validData.name,
         organization: validData.organization,
         title: validData.title || '',
         bio: validData.bio || '',
         pdfUrl: validData.avatar || '',
      });

      revalidatePath('/dashboard/speakers');
      return speaker;
   });
}

// Updated to accept a typed object directly
export async function updateSpeaker(id: string, data: SpeakerFormData) {
   return validateAndExecute(speakerSchema, data, async (validData) => {
      const speaker = await speakerService.updateSpeaker(id, {
         name: validData.name,
         organization: validData.organization,
         title: validData.title || '',
         bio: validData.bio || '',
         pdfUrl: validData.avatar || '',
      });

      revalidatePath('/dashboard/speakers');
      return speaker;
   });
}

export async function deleteSpeaker(id: string) {
   try {
      await speakerService.deleteSpeaker(id);
      revalidatePath('/dashboard/speakers');
      return { success: true };
   } catch (error) {
      console.error('Failed to delete speaker:', error);
      return { success: false, error: 'Failed to delete speaker' };
   }
}

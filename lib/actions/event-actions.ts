'use server';

import { revalidatePath } from 'next/cache';
import { eventService } from '../services/event-service';
import { eventSchema } from '../validations';
import { z } from 'zod';

type EventInput = z.infer<typeof eventSchema>;

export async function eventsList() {
   return await eventService.eventsList();
}

export async function getEventAction(id: string) {
   const event = await eventService.getEvent(id);
   return event;
}

export async function createEvent(data: any) {
   const parsed = eventSchema.safeParse(data);

   if (!parsed.success) {
      console.error('Validation error:', parsed.error.flatten());
      throw new Error('Invalid data format');
   }

   const validatedData: EventInput = parsed.data;
   try {
      await eventService.createEvent({
         ...validatedData,
         organisationId: 'cm9wl2gcm000vvg4g4zmxh8ik',
      });
      revalidatePath('/dashboard/events');
      return { success: true };
   } catch (error) {
      console.error('Failed to create event:', error);
      return { success: false, error: 'Failed to create event' };
   }
}

export async function updateEvent(id: string, data: any) {
   const parsed = eventSchema.safeParse(data);

   if (!parsed.success) {
      console.error('Validation error:', parsed.error.flatten());
      throw new Error('Invalid data format');
   }

   const validatedData: EventInput = parsed.data;
   try {
      const event = await eventService.updateEvent(id, validatedData);

      revalidatePath(`/dashboard/events/${id}/details`);
      revalidatePath('/dashboard/events');

      return { success: true, message: 'Event updated', data: event };
   } catch (error) {
      console.error('Failed to update event:', error);
      return { success: false, error: 'Failed to update event' };
   }
}

export async function deleteEvent(id: string) {
   try {
      await eventService.deleteEvent(id);
      revalidatePath('/dashboard/events');
   } catch (error) {
      console.error('Failed to delete event:', error);
      return { success: false, error: 'Failed to delete event' };
   }
}

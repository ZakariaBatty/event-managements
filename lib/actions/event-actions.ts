'use server';

import { revalidatePath } from 'next/cache';
import { eventService } from '../services/event-service';
import { eventSchema } from '../validations';
import { z } from 'zod';

type EventInput = z.infer<typeof eventSchema>;

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
   console.log('validatedData', validatedData);
   try {
      await eventService.createEvent(validatedData);
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

      revalidatePath('/dashboard/events');
      revalidatePath(`/dashboard/events/${id}/details`);

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

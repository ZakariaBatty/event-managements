'use server';

import { eventService } from '../services/event-service';

export async function getEventAction(id: string) {
   const event = await eventService.getEvent(id);
   return event;
}

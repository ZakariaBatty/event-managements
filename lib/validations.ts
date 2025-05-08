import { z } from 'zod';

export const eventSchema = z.object({
   title: z.string().min(1, 'Title is required'),
   location: z.string().optional(),
   description: z.string().nullable(),
   startDate: z.date(),
   endDate: z.date(),
   organizers: z.array(z.string()).nullable().optional(),
   Themes: z.array(z.string()).nullable().optional(),
   Goals: z.string().nullable().optional(),
});

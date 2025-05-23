import { z } from 'zod';

// Base schemas for reusable validation
export const dateSchema = z.string().refine(
   (date) => {
      return !isNaN(Date.parse(date));
   },
   {
      message: 'Invalid date format',
   }
);

// Event schema
export const eventSchema = z.object({
   title: z.string().min(3, 'Event name must be at least 3 characters'),
   description: z
      .string()
      .min(10, 'Description must be at least 10 characters'),
   location: z.string().min(3, 'Location must be at least 3 characters'),
   startDate: dateSchema,
   endDate: dateSchema,
   status: z.enum(['upcoming', 'active', 'completed']).optional(),
   organizers: z.array(z.string()).nullable().optional(),
   Themes: z.array(z.string()).nullable().optional(),
   Goals: z.string().nullable().optional(),
});

// Session schema
export const sessionSchema = z.object({
   title: z.string().min(1, 'Title is required'),
   description: z.string().optional(),
   date: z.date({
      required_error: 'Date is required',
      invalid_type_error: 'Date must be a valid date',
   }),
   time: z.string().min(1, 'Time is required'),
   type: z.string().min(1, 'Session type is required'),
   location: z.string().min(1, 'Location is required'),
   eventId: z.string().min(1, 'Event ID is required'),
   speakerIds: z.array(z.string()).optional(),
});

// Speaker schema
export const speakerSchema = z.object({
   name: z.string().min(3, 'Name must be at least 3 characters'),
   organization: z.string().optional(),
   bio: z.string().min(10, 'Bio must be at least 10 characters').optional(),
   title: z.string().optional(),
   avatar: z.string().optional(),
   eventId: z.string().min(1, 'Event ID is required'),
});

// Partner schema
export const partnerSchema = z.object({
   name: z.string().min(2, 'Name must be at least 2 characters'),
   type: z.string().min(1, 'Type is required'),
   website: z
      .string()
      .url('Please enter a valid URL')
      .optional()
      .or(z.literal('')),
   description: z.string().optional(),
   logo: z.string().optional(),
   tier: z.string().optional(),
});

// QR Code schema
export const qrCodeSchema = z.object({
   name: z.string().min(2, 'Name must be at least 2 characters'),
   type: z.string().min(1, 'Type is required'),
   content: z.string().min(1, 'Content is required'),
   description: z.string().optional(),
   foregroundColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
   backgroundColor: z
      .string()
      .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
});

// Location schema
export const locationSchema = z.object({
   name: z.string().min(2, 'Name must be at least 2 characters'),
   address: z.string().min(5, 'Address must be at least 5 characters'),
   city: z.string().min(2, 'City must be at least 2 characters'),
   country: z.string().min(2, 'Country must be at least 2 characters'),
   postalCode: z.string().optional(),
   description: z.string().optional(),
   capacity: z
      .number()
      .positive('Capacity must be a positive number')
      .optional()
      .nullable(),
   latitude: z.number().min(-90).max(90).optional().nullable(),
   longitude: z.number().min(-180).max(180).optional().nullable(),
});

// Invite schema
export const inviteSchema = z.object({
   name: z.string().min(2, 'Name must be at least 2 characters'),
   email: z.string().email('Please enter a valid email address').optional(),
   phone: z.string().optional(),
   address: z.string().optional(),
   notes: z.string().optional(),
   position: z.string().optional(),
   domain: z.string().optional(),

   type: z.enum(['INVITE', 'VISITOR', 'CLIENT']).default('INVITE'),
   status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).default('PENDING'),

   eventId: z.string().min(1, 'Event ID is required'),
   countryId: z.string().optional(),
});

export type Country = {
   id: string;
   name: string;
   code: string;
   createdAt: Date;
   updatedAt: Date;
};

// Define types from schemas
export type EventFormData = z.infer<typeof eventSchema>;
export type SessionFormData = z.infer<typeof sessionSchema>;
export type SpeakerFormData = z.infer<typeof speakerSchema>;
export type PartnerFormData = z.infer<typeof partnerSchema>;
export type QRCodeFormData = z.infer<typeof qrCodeSchema>;
export type LocationFormData = z.infer<typeof locationSchema>;
export type InviteFormData = z.infer<typeof inviteSchema>;

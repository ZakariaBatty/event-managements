'use server';

import { z } from 'zod';
import { inviteSchema, type InviteFormData } from '../schemas';
import { inviteService } from '../services/invite-service';
import { revalidatePath } from 'next/cache';

export async function getInvites({
   page,
   limit,
   type,
}: {
   page: number;
   limit: number;
   type: 'INVITE' | 'CLIENT';
}) {
   try {
      const { data, meta } = await inviteService.getInvites(page, limit, {
         type,
      });
      return { success: true, data, meta };
   } catch (error) {
      console.error('Failed to get invites:', error);
      return { success: false, error: 'Failed to get invites' };
   }
}

export async function getInviteById(id: string) {
   try {
      const data = await inviteService.getInvite(id);
      return { success: true, data };
   } catch (error) {
      console.error('Failed to get invite by ID:', error);
      return { success: false, error: 'Failed to get invite by ID' };
   }
}

export async function getInvitesByEventId(
   eventId: string,
   type: 'INVITE' | 'CLIENT'
) {
   try {
      const data = await inviteService.getInvitesByEvent(eventId, type);
      return { success: true, data };
   } catch (error) {
      console.error('Failed to get invites by event ID:', error);
      return { success: false, error: 'Failed to get invites by event ID' };
   }
}

export async function getInvitesByStatus(eventId?: string, type?: string) {
   try {
      const stats = await inviteService.getInviteStats(eventId, type);
      return { success: true, stats };
   } catch (error) {
      console.error('Failed to get invites by status:', error);
      return { success: false, error: 'Failed to get invites by status' };
   }
}

export async function getInvitesByType(type: string) {
   try {
      const { data } = await inviteService.getInvitesByType(type, 1, 50);
      return { success: true, data };
   } catch (error) {
      console.error(`Failed to get ${type} invites:`, error);
      return { success: false, error: `Failed to get ${type} invites` };
   }
}

export async function createInvite(formData: FormData) {
   try {
      let data: InviteFormData;

      // Check type formaData
      if (formData instanceof FormData) {
         data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            notes: formData.get('notes') as string,
            domain: formData.get('domain') as string,
            type: formData.get('type') as 'INVITE' | 'VISITOR' | 'CLIENT',
            status: formData.get('status') as
               | 'PENDING'
               | 'APPROVED'
               | 'REJECTED',
            eventId: formData.get('eventId') as string,
            countryId: formData.get('countryId') as string,
         };
      } else {
         // Direct object passing
         data = formData;
      }

      try {
         inviteSchema.parse(data);
      } catch (validationError) {
         if (validationError instanceof z.ZodError) {
            const errors = validationError.errors
               .map((err) => `${err.path.join('.')}: ${err.message}`)
               .join(', ');
            return { success: false, error: `Validation failed: ${errors}` };
         }
         return { success: false, error: 'Validation failed' };
      }
      // Call service to create the invite
      const result = await inviteService.createInvite(data);
      revalidatePath(`/dashboard/invites`);
      return { success: true, data: result };
   } catch (error) {
      console.error('Failed to create invite:', error);
      return { success: false, error: 'Failed to create invite' };
   }
}

export async function updateInvite(id: string, formData: FormData) {
   try {
      let data: InviteFormData;

      // Check type formaData
      if (formData instanceof FormData) {
         data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            notes: formData.get('notes') as string,
            domain: formData.get('domain') as string,
            type: formData.get('type') as 'INVITE' | 'VISITOR' | 'CLIENT',
            status: formData.get('status') as
               | 'PENDING'
               | 'APPROVED'
               | 'REJECTED',
            eventId: formData.get('eventId') as string,
            countryId: formData.get('countryId') as string,
         };
      } else {
         // Direct object passing
         data = formData;
      }

      try {
         inviteSchema.parse(data);
      } catch (validationError) {
         if (validationError instanceof z.ZodError) {
            const errors = validationError.errors
               .map((err) => `${err.path.join('.')}: ${err.message}`)
               .join(', ');
            return { success: false, error: `Validation failed: ${errors}` };
         }
         return { success: false, error: 'Validation failed' };
      }
      // Call service to update the invite
      const result = await inviteService.updateInvite(id, data);
      revalidatePath(`/dashboard/invites`);
      return { success: true, data: result };
   } catch (error) {
      console.error('Failed to update invite:', error);
      return { success: false, error: 'Failed to update invite' };
   }
}

export async function deleteInvite(id: string) {
   try {
      await inviteService.deleteInvite(id);
      revalidatePath('/dashboard/invites');
      return { success: true };
   } catch (error) {
      console.error('Failed to delete invite:', error);
      return { success: false, error: 'Failed to delete invite' };
   }
}

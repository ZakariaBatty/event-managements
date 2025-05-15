import { SessionType } from '@prisma/client';
import { sideEventItemRepository } from '../repositories/side-event-repository';
import { SessionFormData } from '../schemas';
import { speakerRepository } from '../repositories/speaker-repository';

export const programmeService = {
   async getProgramme(eventId: string) {
      // Get all side event items for this event
      const items = await sideEventItemRepository.findByEvent(eventId);

      // Group items by date
      const groupedByDate = items.reduce(
         (acc: Record<string, { date: string; items: any[] }>, item) => {
            const date = item.date
               ? new Date(item.date).toISOString().split('T')[0]
               : 'No Date';

            if (!acc[date]) {
               acc[date] = {
                  date,
                  items: [],
               };
            }

            acc[date].items.push(item);
            return acc;
         },
         {}
      );

      // Convert to array and sort by date
      return Object.values(groupedByDate).sort((a: any, b: any) => {
         return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
   },

   async getProgrammeItem(id: string) {
      return sideEventItemRepository.findById(id);
   },

   async createProgrammeItem(data: SessionFormData) {
      try {
         // Create the programme item
         const sideEventItem = await sideEventItemRepository.create({
            title: data.title,
            description: data.description || '',
            time: data.time || '',
            type: data.type as SessionType,
            location: data.location || '',
            date: data.date,
            event: {
               connect: {
                  id: data.eventId,
               },
            },
            speakers: {
               connect: Array.isArray(data.speakerIds)
                  ? data.speakerIds.map((id) => ({ id }))
                  : [],
            },
         });

         return sideEventItem;
      } catch (error) {
         console.error('Error creating programme item:', error);
         throw error;
      }
   },

   async updateProgrammeItem(id: string, data: Partial<SessionFormData>) {
      try {
         // Handle speakers update
         let speakersUpdate = {};
         if (data.speakerIds) {
            speakersUpdate = {
               speakers: {
                  set: [], // Clear existing connections
                  connect: data.speakerIds.map((id) => ({ id })),
               },
            };
         }

         // Update the programme item
         const updatedItem = await sideEventItemRepository.update(id, {
            ...(data.title && { title: data.title }),
            ...(data.description !== undefined && {
               description: data.description,
            }),
            ...(data.time !== undefined && { time: data.time }),
            ...(data.type && { type: data.type as SessionType }),
            ...(data.location !== undefined && { location: data.location }),
            ...(data.date && { date: data.date }),
            ...speakersUpdate,
         });

         return updatedItem;
      } catch (error) {
         console.error('Error updating programme item:', error);
         throw error;
      }
   },

   async deleteProgrammeItem(id: string) {
      try {
         return await sideEventItemRepository.delete(id);
      } catch (error) {
         console.error('Error deleting programme item:', error);
         throw error;
      }
   },

   async createSideEventItemWithSpeakers(data: any) {
      try {
         // Process speakers
         let speakersConnect = [];
         if (
            data.speakers &&
            Array.isArray(data.speakers) &&
            data.speakers.length > 0
         ) {
            // If speakers are provided as strings (names), create them
            if (typeof data.speakers[0] === 'string') {
               const createdSpeakers = await Promise.all(
                  data.speakers.map(async (name: string) => {
                     return await speakerRepository.create({
                        name,
                        organization: data.organization || '',
                        bio: '',
                        events: {
                           connect: {
                              id: data.eventId,
                           },
                        },
                     });
                  })
               );
               speakersConnect = createdSpeakers.map((speaker) => ({
                  id: speaker.id,
               }));
            } else {
               // If speakers are provided as IDs
               speakersConnect = data.speakers.map((id: string) => ({ id }));
            }
         }

         // Create the programme item
         const sideEventItem = await sideEventItemRepository.create({
            title: data.title,
            description: data.description || '',
            time: data.time || '',
            type: data.type,
            location: data.location || '',
            date: data.date,
            event: {
               connect: {
                  id: data.eventId,
               },
            },
            speakers: {
               connect: speakersConnect,
            },
         });

         return sideEventItem;
      } catch (error) {
         console.error('Error creating side event item with speakers:', error);
         throw error;
      }
   },
};

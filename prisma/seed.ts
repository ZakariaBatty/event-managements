import {
   ContactStatus,
   ContactType,
   EventStatus,
   InvoiceStatus,
   PrismaClient,
   QRCodeType,
   Role,
   SessionType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
   console.log('🌱 Starting seed process...');

   // Clean up existing data (optional - comment out if not needed)
   await cleanDatabase();

   // Create countries first (they're referenced by other entities)
   const countries = await createCountries(20);
   console.log(`✅ Created ${countries.length} countries`);

   // Create users with different roles
   const users = await createUsers(50);
   console.log(`✅ Created ${users.length} users`);

   // Create organizations (some linked to users)
   const organisations = await createOrganisations(30, users);
   console.log(`✅ Created ${organisations.length} organisations`);

   // Create locations for events
   const locations = await createLocations(15, countries);
   console.log(`✅ Created ${locations.length} locations`);

   // Create speakers
   const speakers = await createSpeakers(40);
   console.log(`✅ Created ${speakers.length} speakers`);

   // Create events
   const events = await createEvents(25, organisations, countries);
   console.log(`✅ Created ${events.length} events`);

   // Create side event items
   await createSideEventItems(60, events, speakers);
   console.log(`✅ Created side event items`);

   // Create contacts
   const contacts = await createContacts(100, events, countries);
   console.log(`✅ Created ${contacts.length} contacts`);

   // Create QR codes
   await createQRCodes(50, events);
   console.log(`✅ Created QR codes`);

   // Create invoices
   await createInvoices(80, events, contacts);
   console.log(`✅ Created invoices`);

   // Create hotels
   await createHotels(20);
   console.log(`✅ Created hotels`);

   console.log('🎉 Seed completed successfully!');
}

async function cleanDatabase() {
   console.log('🧹 Cleaning database...');

   // Delete in order to respect foreign key constraints
   await prisma.invoice.deleteMany({});
   await prisma.qRCode.deleteMany({});
   await prisma.contact.deleteMany({});
   await prisma.sideEventItem.deleteMany({});
   await prisma.speaker.deleteMany({});
   await prisma.event.deleteMany({});
   await prisma.location.deleteMany({});
   await prisma.hotel.deleteMany({});
   await prisma.organisation.deleteMany({});
   await prisma.user.deleteMany({});
   await prisma.country.deleteMany({});

   console.log('✅ Database cleaned');
}

async function createCountries(count: number) {
   const countries = [];

   for (let i = 0; i < count; i++) {
      const name = faker.location.country();
      const code = faker.location.countryCode();

      const existing = await prisma.country.findFirst({
         where: { OR: [{ name }, { code }] },
      });

      if (!existing) {
         const country = await prisma.country.create({
            data: { name, code },
         });
         countries.push(country);
      } else {
         countries.push(existing); // Optionally add it to the list
      }
   }

   return countries;
}

async function createUsers(count: number) {
   const users = [];
   const roles: Role[] = ['USER', 'ORGANISER', 'ADMIN'];

   for (let i = 0; i < count; i++) {
      const role = roles[Math.floor(Math.random() * roles.length)];
      const user = await prisma.user.create({
         data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            emailVerified: Math.random() > 0.3 ? faker.date.past() : null,
            image: Math.random() > 0.5 ? faker.image.avatar() : null,
            codeVerification:
               Math.random() > 0.7 ? faker.string.alphanumeric(6) : null,
            password: faker.internet.password(),
            number: faker.phone.number(),
            role: role,
         },
      });
      users.push(user);
   }

   return users;
}

async function createOrganisations(count: number, users: any[]) {
   const organisations = [];
   const availableUsers = [
      ...users.filter((u) => u.role === 'ORGANISER' || u.role === 'ADMIN'),
   ];

   for (let i = 0; i < count; i++) {
      // Assign a user to some organisations
      let userId = null;
      if (availableUsers.length > 0 && Math.random() > 0.3) {
         const userIndex = Math.floor(Math.random() * availableUsers.length);
         userId = availableUsers[userIndex].id;
         // Remove the user so they don't get assigned to multiple organisations
         availableUsers.splice(userIndex, 1);
      }

      const organisation = await prisma.organisation.create({
         data: {
            companyName: faker.company.name(),
            email: faker.internet.email(),
            logoUrl: Math.random() > 0.3 ? faker.image.url() : null,
            website: Math.random() > 0.4 ? faker.internet.url() : null,
            numberCompany: faker.phone.number(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            userId: userId,
         },
      });
      organisations.push(organisation);
   }

   return organisations;
}

async function createLocations(count: number, countries: any[]) {
   const locations = [];

   for (let i = 0; i < count; i++) {
      const location = await prisma.location.create({
         data: {
            name: faker.company.name() + ' ' + faker.location.buildingNumber(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode(),
            description: faker.lorem.paragraph(),
            capacity: Math.floor(Math.random() * 1000) + 50,
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            visibility: Math.random() > 0.1,
         },
      });
      locations.push(location);
   }

   return locations;
}

async function createSpeakers(count: number) {
   const speakers = [];

   for (let i = 0; i < count; i++) {
      const speaker = await prisma.speaker.create({
         data: {
            name: faker.person.fullName(),
            organization: faker.company.name(),
            bio: faker.lorem.paragraphs(2),
            title: faker.person.jobTitle(),
            avatar: Math.random() > 0.3 ? faker.image.avatar() : null,
         },
      });
      speakers.push(speaker);
   }

   return speakers;
}

async function createEvents(
   count: number,
   organisations: any[],
   countries: any[]
) {
   const events = [];
   const statuses: EventStatus[] = [
      'UPCOMING',
      'ACTIVE',
      'CANCELLED',
      'COMPLETED',
   ];

   for (let i = 0; i < count; i++) {
      const startDate = faker.date.future();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);

      const randomCountry =
         countries[Math.floor(Math.random() * countries.length)];
      const randomOrganisation =
         organisations[Math.floor(Math.random() * organisations.length)];

      const themes = [];
      for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
         themes.push(faker.lorem.word());
      }

      const organizers = [];
      for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
         organizers.push({
            name: faker.person.fullName(),
            role: faker.person.jobTitle(),
         });
      }

      const event = await prisma.event.create({
         data: {
            title: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(3),
            organizers: organizers,
            Goals: faker.lorem.paragraph(),
            Themes: themes,
            startDate: startDate,
            endDate: endDate,
            location: faker.location.city() + ', ' + randomCountry.name,
            logo: Math.random() > 0.3 ? faker.image.url() : null,
            coverImage: Math.random() > 0.3 ? faker.image.url() : null,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            countryId: randomCountry.id,
            organisationId: randomOrganisation.id,
         },
      });
      events.push(event);
   }

   return events;
}

async function createSideEventItems(
   count: number,
   events: any[],
   speakers: any[]
) {
   const sessionTypes: SessionType[] = [
      'MASTER_CLASS',
      'WORKSHOP',
      'KEYNOTE',
      'PANEL',
      'NETWORKING',
   ];

   for (let i = 0; i < count; i++) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];

      // Get 1-3 random speakers
      const sessionSpeakers: any[] = [];
      const speakerCount = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < speakerCount; j++) {
         const randomSpeaker =
            speakers[Math.floor(Math.random() * speakers.length)];
         if (!sessionSpeakers.includes(randomSpeaker.id)) {
            sessionSpeakers.push({ id: randomSpeaker.id });
         }
      }

      // Create a date between the event start and end dates
      const eventStartDate = new Date(randomEvent.startDate);
      const eventEndDate = new Date(randomEvent.endDate);
      const daysDiff = Math.floor(
         (eventEndDate.getTime() - eventStartDate.getTime()) /
            (1000 * 60 * 60 * 24)
      );
      const randomDayOffset = Math.floor(Math.random() * (daysDiff + 1));
      const sessionDate = new Date(eventStartDate);
      sessionDate.setDate(sessionDate.getDate() + randomDayOffset);

      await prisma.sideEventItem.create({
         data: {
            title: faker.company.catchPhrase(),
            description: faker.lorem.paragraph(),
            date: sessionDate,
            time: `${Math.floor(Math.random() * 12) + 8}:${
               Math.random() > 0.5 ? '00' : '30'
            } - ${Math.floor(Math.random() * 12) + 8}:${
               Math.random() > 0.5 ? '00' : '30'
            }`,
            type: sessionTypes[Math.floor(Math.random() * sessionTypes.length)],
            location: faker.location.city(),
            eventId: randomEvent.id,
            speakers: {
               connect: sessionSpeakers,
            },
         },
      });
   }
}

async function createContacts(count: number, events: any[], countries: any[]) {
   const contacts = [];
   const contactTypes = [
      'CLIENT',
      'INVITE',
      'PARTNER',
      'VISITOR',
      'EXHIBITOR',
      'SPONSOR',
      'MEDIA_PARTNER',
      'COMMUNITY_PARTNER',
      'TECHNOLOGY_PARTNER',
   ];
   const contactStatuses = ['PENDING', 'ACCEPTED', 'DECLINED'];

   for (let i = 0; i < count; i++) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const randomCountry =
         countries[Math.floor(Math.random() * countries.length)];

      const expiryDate = Math.random() > 0.5 ? faker.date.future() : null;

      const contact = await prisma.contact.create({
         data: {
            type: contactTypes[
               Math.floor(Math.random() * contactTypes.length)
            ] as ContactType,
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            company: Math.random() > 0.3 ? faker.company.name() : null,
            address:
               Math.random() > 0.5 ? faker.location.streetAddress() : null,
            city: Math.random() > 0.5 ? faker.location.city() : null,
            notes: Math.random() > 0.7 ? faker.lorem.paragraph() : null,
            website: Math.random() > 0.6 ? faker.internet.url() : null,
            description: Math.random() > 0.5 ? faker.lorem.paragraph() : null,
            logo: Math.random() > 0.7 ? faker.image.url() : null,
            tier:
               Math.random() > 0.5
                  ? ['Gold', 'Silver', 'Bronze', 'Platinum'][
                       Math.floor(Math.random() * 4)
                    ]
                  : null,
            status: contactStatuses[
               Math.floor(Math.random() * contactStatuses.length)
            ] as ContactStatus,
            token: Math.random() > 0.5 ? faker.string.uuid() : null,
            expiresAt: expiryDate,
            message: Math.random() > 0.7 ? faker.lorem.paragraph() : null,
            visibility: Math.random() > 0.1,
            eventId: randomEvent.id,
            countryId: randomCountry.id,
         },
      });
      contacts.push(contact);
   }

   return contacts;
}

async function createQRCodes(count: number, events: any[]) {
   const qrCodeTypes = [
      'URL',
      'TEXT',
      'EMAIL',
      'PHONE',
      'SMS',
      'WIFI',
      'VCARD',
   ];

   for (let i = 0; i < count; i++) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const type = qrCodeTypes[Math.floor(Math.random() * qrCodeTypes.length)];

      let content = '';
      switch (type) {
         case 'URL':
            content = faker.internet.url();
            break;
         case 'TEXT':
            content = faker.lorem.sentence();
            break;
         case 'EMAIL':
            content = faker.internet.email();
            break;
         case 'PHONE':
            content = faker.phone.number();
            break;
         case 'SMS':
            content = faker.lorem.sentence();
            break;
         case 'WIFI':
            content = `SSID:${faker.internet.domainWord()};PASSWORD:${faker.internet.password()}`;
            break;
         case 'VCARD':
            content = `BEGIN:VCARD\nVERSION:3.0\nN:${faker.person.lastName()};${faker.person.firstName()}\nFN:${faker.person.fullName()}\nORG:${faker.company.name()}\nTEL:${faker.phone.number()}\nEMAIL:${faker.internet.email()}\nEND:VCARD`;
            break;
      }

      await prisma.qRCode.create({
         data: {
            name: faker.lorem.words(3),
            type: type as QRCodeType,
            content: content,
            description: Math.random() > 0.5 ? faker.lorem.sentence() : null,
            foregroundColor:
               Math.random() > 0.5 ? faker.internet.color() : '#000000',
            backgroundColor:
               Math.random() > 0.5 ? faker.internet.color() : '#FFFFFF',
            eventId: randomEvent.id,
         },
      });
   }
}

async function createInvoices(count: number, events: any[], contacts: any[]) {
   const invoiceStatuses = ['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED'];

   for (let i = 0; i < count; i++) {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      // Filter contacts to only get those associated with this event
      const eventContacts = contacts.filter(
         (contact) => contact.eventId === randomEvent.id
      );

      if (eventContacts.length === 0) continue;

      const randomContact =
         eventContacts[Math.floor(Math.random() * eventContacts.length)];

      await prisma.invoice.create({
         data: {
            number: `INV-${faker.string.numeric(6)}`,
            amount: parseFloat(
               (Math.random() * (10000 - 100) + 100).toFixed(2)
            ),
            status: invoiceStatuses[
               Math.floor(Math.random() * invoiceStatuses.length)
            ] as InvoiceStatus,
            dueDate: faker.date.future(),
            eventId: randomEvent.id,
            contactId: randomContact.id,
         },
      });
   }
}

async function createHotels(count: number) {
   for (let i = 0; i < count; i++) {
      await prisma.hotel.create({
         data: {
            name: faker.company.name() + ' Hotel',
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode(),
            description: faker.lorem.paragraph(),
            capacity: Math.floor(Math.random() * 500) + 50,
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
            visibility: Math.random() > 0.1,
         },
      });
   }
}

main()
   .catch((e) => {
      console.error('Error during seeding:', e);
      process.exit(1);
   })
   .finally(async () => {
      await prisma.$disconnect();
   });

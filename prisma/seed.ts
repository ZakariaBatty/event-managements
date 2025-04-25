import {
   PrismaClient,
   Role,
   EventStatus,
   SessionType,
   QRCodeType,
   InvoiceStatus,
   ContactType,
   ContactStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
   console.log('🌱 Starting seeding process...');

   // Clear existing data
   await clearDatabase();

   // Create countries
   const countries = await seedCountries();
   console.log(`✅ Created ${countries.length} countries`);

   // Create users with different roles
   const users = await seedUsers(10);
   console.log(`✅ Created ${users.length} users`);

   // Create organisations linked to users
   const organisations = await seedOrganisations(users);
   console.log(`✅ Created ${organisations.length} organisations`);

   // Create events for each organisation
   const events = await seedEvents(organisations);
   console.log(`✅ Created ${events.length} events`);

   // Create locations
   const locations = await seedLocations(20);
   console.log(`✅ Created ${locations.length} locations`);

   // Assign locations to events
   await assignLocationsToEvents(events, locations);
   console.log('✅ Assigned locations to events');

   // Create speakers
   const speakers = await seedSpeakers(30);
   console.log(`✅ Created ${speakers.length} speakers`);

   // Create side events and assign speakers
   const sideEvents = await seedSideEvents(events, speakers);
   console.log(`✅ Created ${sideEvents.length} side events`);

   // Create contacts
   const contacts = await seedContacts(events, countries);
   console.log(`✅ Created ${contacts.length} contacts`);

   // Create QR codes
   const qrCodes = await seedQRCodes(events);
   console.log(`✅ Created ${qrCodes.length} QR codes`);

   // Create invoices
   const invoices = await seedInvoices(events, contacts);
   console.log(`✅ Created ${invoices.length} invoices`);

   // Assign countries to events
   await assignCountriesToEvents(events, countries);
   console.log('✅ Assigned countries to events');

   // Create hotels
   const hotels = await seedHotels(15);
   console.log(`✅ Created ${hotels.length} hotels`);

   console.log('🎉 Seeding completed successfully!');
}

async function clearDatabase() {
   // Delete in reverse order of dependencies
   await prisma.countryContact.deleteMany({});
   await prisma.countryEvent.deleteMany({});
   await prisma.invoice.deleteMany({});
   await prisma.qRCode.deleteMany({});
   await prisma.contact.deleteMany({});
   await prisma.sideEventItem.deleteMany({});
   await prisma.speaker.deleteMany({});
   await prisma.location.deleteMany({});
   await prisma.event.deleteMany({});
   await prisma.hotel.deleteMany({});
   await prisma.organisation.deleteMany({});
   await prisma.user.deleteMany({});
   await prisma.country.deleteMany({});

   console.log('🧹 Cleared existing database records');
}

async function seedUsers(count: number) {
   const users = [];

   // Create one admin user
   const adminUser = await prisma.user.create({
      data: {
         name: 'Admin User',
         email: 'admin@example.com',
         password: 'password123', // In a real app, this would be hashed
         number: faker.phone.number(),
         role: Role.ADMIN,
         emailVerified: faker.date.past(),
      },
   });
   users.push(adminUser);

   // Create one organiser user
   const organiserUser = await prisma.user.create({
      data: {
         name: 'Organiser User',
         email: 'organiser@example.com',
         password: 'password123', // In a real app, this would be hashed
         number: faker.phone.number(),
         role: Role.ORGANISER,
         emailVerified: faker.date.past(),
      },
   });
   users.push(organiserUser);

   // Create regular users
   for (let i = 0; i < count - 2; i++) {
      const user = await prisma.user.create({
         data: {
            name: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: 'password123', // In a real app, this would be hashed
            number: faker.phone.number(),
            role: Role.USER,
            emailVerified: Math.random() > 0.3 ? faker.date.past() : null,
            image: Math.random() > 0.5 ? faker.image.avatar() : null,
         },
      });
      users.push(user);
   }

   return users;
}

async function seedOrganisations(users: any[]) {
   const organisations = [];

   // Create organisations for some users
   for (let i = 0; i < users.length; i++) {
      if (i < 5) {
         // Only create organisations for some users
         const organisation = await prisma.organisation.create({
            data: {
               companyName: faker.company.name(),
               email: faker.internet.email().toLowerCase(),
               logoUrl: Math.random() > 0.3 ? faker.image.url() : null,
               website: Math.random() > 0.3 ? faker.internet.url() : null,
               numberCompany: faker.phone.number(),
               address: faker.location.streetAddress(),
               city: faker.location.city(),
               country: faker.location.country(),
               userId: users[i].id,
            },
         });
         organisations.push(organisation);
      }
   }

   return organisations;
}

async function seedEvents(organisations: any[]) {
   const events = [];
   const statuses = Object.values(EventStatus);

   for (const org of organisations) {
      // Each organisation has 1-3 events
      const eventCount = Math.floor(Math.random() * 3) + 1;

      for (let i = 0; i < eventCount; i++) {
         const startDate = faker.date.future();
         const endDate = new Date(startDate);
         endDate.setDate(
            startDate.getDate() + Math.floor(Math.random() * 5) + 1
         );

         const themes = [];
         for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
            themes.push(faker.word.sample());
         }

         const organizers = [];
         for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
            organizers.push(faker.word.sample());
         }

         const event = await prisma.event.create({
            data: {
               title: faker.company.catchPhrase(),
               description: faker.lorem.paragraphs(2),
               organizers: organizers,
               Goals: faker.lorem.paragraph(),
               Themes: themes,
               startDate,
               endDate,
               location: `${faker.location.city()}, ${faker.location.country()}`,
               logo: Math.random() > 0.3 ? faker.image.url() : null,
               coverImage: Math.random() > 0.3 ? faker.image.url() : null,
               status: statuses[Math.floor(Math.random() * statuses.length)],
               organisationId: org.id,
            },
         });

         events.push(event);
      }
   }

   return events;
}

async function seedLocations(count: number) {
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
            capacity: Math.floor(Math.random() * 500) + 50,
            latitude: Number.parseFloat(faker.location.latitude() as any),
            longitude: Number.parseFloat(faker.location.longitude() as any),
            visibility: Math.random() > 0.1, // 90% visible
         },
      });

      locations.push(location);
   }

   return locations;
}

async function assignLocationsToEvents(events: any[], locations: any[]) {
   for (const event of events) {
      // Assign 1-3 random locations to each event
      const locationCount = Math.floor(Math.random() * 3) + 1;
      const shuffledLocations = [...locations].sort(() => 0.5 - Math.random());

      for (let i = 0; i < locationCount && i < shuffledLocations.length; i++) {
         await prisma.event.update({
            where: { id: event.id },
            data: {
               locations: {
                  connect: { id: shuffledLocations[i].id },
               },
            },
         });
      }
   }
}

async function seedSpeakers(count: number) {
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

async function seedSideEvents(events: any[], speakers: any[]) {
   const sideEvents = [];
   const sessionTypes = Object.values(SessionType);

   for (const event of events) {
      // Each event has 2-5 side events
      const sideEventCount = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < sideEventCount; i++) {
         const eventDate = new Date(event.startDate);
         eventDate.setHours(
            eventDate.getHours() + Math.floor(Math.random() * 48)
         );

         const hours = Math.floor(Math.random() * 12) + 8; // 8 AM to 8 PM
         const minutes = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
         const timeStr = `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}`;

         // Select 1-3 random speakers
         const speakerCount = Math.floor(Math.random() * 3) + 1;
         const shuffledSpeakers = [...speakers].sort(() => 0.5 - Math.random());
         const selectedSpeakers = shuffledSpeakers.slice(0, speakerCount);

         const sideEvent = await prisma.sideEventItem.create({
            data: {
               title: faker.company.catchPhrase(),
               description: faker.lorem.paragraphs(1),
               date: eventDate,
               time: timeStr,
               type: sessionTypes[
                  Math.floor(Math.random() * sessionTypes.length)
               ],
               location: `${faker.location.city()}, Room ${faker.location.buildingNumber()}`,
               eventId: event.id,
               speakers: {
                  connect: selectedSpeakers.map((speaker) => ({
                     id: speaker.id,
                  })),
               },
            },
         });

         sideEvents.push(sideEvent);
      }
   }

   return sideEvents;
}

async function seedContacts(events: any[], countries: any[]) {
   const contacts = [];
   const contactTypes = Object.values(ContactType);
   const contactStatuses = Object.values(ContactStatus);

   for (const event of events) {
      // Each event has 5-15 contacts
      const contactCount = Math.floor(Math.random() * 11) + 5;

      for (let i = 0; i < contactCount; i++) {
         const contactType =
            contactTypes[Math.floor(Math.random() * contactTypes.length)];
         const status =
            contactStatuses[Math.floor(Math.random() * contactStatuses.length)];

         const contact = await prisma.contact.create({
            data: {
               type: contactType,
               name: faker.person.fullName(),
               email: faker.internet.email().toLowerCase(),
               phone: faker.phone.number(),
               company: faker.company.name(),
               address: faker.location.streetAddress(),
               city: faker.location.city(),
               notes: Math.random() > 0.5 ? faker.lorem.paragraph() : null,
               website: Math.random() > 0.5 ? faker.internet.url() : null,
               description:
                  Math.random() > 0.5 ? faker.lorem.paragraph() : null,
               logo: Math.random() > 0.3 ? faker.image.url() : null,
               tier:
                  Math.random() > 0.5
                     ? ['Gold', 'Silver', 'Bronze', 'Platinum'][
                          Math.floor(Math.random() * 4)
                       ]
                     : null,
               status,
               token: Math.random() > 0.5 ? faker.string.uuid() : null,
               expiresAt: Math.random() > 0.5 ? faker.date.future() : null,
               message: Math.random() > 0.5 ? faker.lorem.paragraph() : null,
               visibility: Math.random() > 0.1, // 90% visible
               eventId: event.id,
            },
         });

         contacts.push(contact);

         // Assign 1-3 random countries to some contacts
         if (Math.random() > 0.5) {
            const countryCount = Math.floor(Math.random() * 3) + 1;
            const shuffledCountries = [...countries].sort(
               () => 0.5 - Math.random()
            );

            for (
               let j = 0;
               j < countryCount && j < shuffledCountries.length;
               j++
            ) {
               await prisma.countryContact.create({
                  data: {
                     contactId: contact.id,
                     countryId: shuffledCountries[j].id,
                  },
               });
            }
         }
      }
   }

   return contacts;
}

async function seedQRCodes(events: any[]) {
   const qrCodes = [];
   const qrCodeTypes = Object.values(QRCodeType);

   for (const event of events) {
      // Each event has 2-5 QR codes
      const qrCodeCount = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < qrCodeCount; i++) {
         const qrCodeType =
            qrCodeTypes[Math.floor(Math.random() * qrCodeTypes.length)];
         let content = '';

         switch (qrCodeType) {
            case 'URL':
               content = faker.internet.url();
               break;
            case 'TEXT':
               content = faker.lorem.sentence();
               break;
            case 'EMAIL':
               content = faker.internet.email().toLowerCase();
               break;
            case 'PHONE':
               content = faker.phone.number();
               break;
            case 'SMS':
               content = `${faker.phone.number()}:${faker.lorem.sentence()}`;
               break;
            case 'WIFI':
               content = `SSID:${faker.internet.domainWord()};PASSWORD:${faker.internet.password()};TYPE:WPA`;
               break;
            case 'VCARD':
               content = `BEGIN:VCARD\nVERSION:3.0\nN:${faker.person.lastName()};${faker.person.firstName()}\nFN:${faker.person.fullName()}\nORG:${faker.company.name()}\nTITLE:${faker.person.jobTitle()}\nTEL:${faker.phone.number()}\nEMAIL:${faker.internet.email()}\nEND:VCARD`;
               break;
         }

         const qrCode = await prisma.qRCode.create({
            data: {
               name: `${event.title} - ${qrCodeType} ${i + 1}`,
               type: qrCodeType,
               content,
               description: Math.random() > 0.5 ? faker.lorem.sentence() : null,
               foregroundColor:
                  Math.random() > 0.3 ? faker.color.rgb() : '#000000',
               backgroundColor:
                  Math.random() > 0.3 ? faker.color.rgb() : '#FFFFFF',
               eventId: event.id,
            },
         });

         qrCodes.push(qrCode);
      }
   }

   return qrCodes;
}

async function seedInvoices(events: any[], contacts: any[]) {
   const invoices = [];
   const invoiceStatuses = Object.values(InvoiceStatus);

   for (const event of events) {
      // Get contacts for this event
      const eventContacts = contacts.filter(
         (contact) => contact.eventId === event.id
      );

      if (eventContacts.length === 0) continue;

      // Each event has invoices for some contacts
      for (const contact of eventContacts) {
         if (Math.random() > 0.7) {
            // Only 30% of contacts get invoices
            const invoiceCount = Math.floor(Math.random() * 2) + 1; // 1-2 invoices per contact

            for (let i = 0; i < invoiceCount; i++) {
               const status =
                  invoiceStatuses[
                     Math.floor(Math.random() * invoiceStatuses.length)
                  ];
               const dueDate = faker.date.future();

               const invoice = await prisma.invoice.create({
                  data: {
                     number: `INV-${faker.string
                        .alphanumeric(8)
                        .toUpperCase()}`,
                     amount: faker.number.float({
                        min: 100,
                        max: 10000,
                        fractionDigits: 2,
                     }),
                     status,
                     dueDate,
                     contactId: contact.id,
                     eventId: event.id,
                  },
               });

               invoices.push(invoice);
            }
         }
      }
   }

   return invoices;
}

async function seedCountries() {
   // List of common countries with their codes
   const countryData = [
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'Canada', code: 'CA' },
      { name: 'Australia', code: 'AU' },
      { name: 'Germany', code: 'DE' },
      { name: 'France', code: 'FR' },
      { name: 'Japan', code: 'JP' },
      { name: 'China', code: 'CN' },
      { name: 'India', code: 'IN' },
      { name: 'Brazil', code: 'BR' },
      { name: 'South Africa', code: 'ZA' },
      { name: 'Mexico', code: 'MX' },
      { name: 'Spain', code: 'ES' },
      { name: 'Italy', code: 'IT' },
      { name: 'Netherlands', code: 'NL' },
      { name: 'Sweden', code: 'SE' },
      { name: 'Norway', code: 'NO' },
      { name: 'Denmark', code: 'DK' },
      { name: 'Finland', code: 'FI' },
      { name: 'Singapore', code: 'SG' },
   ];

   const countries = [];

   for (const country of countryData) {
      const createdCountry = await prisma.country.create({
         data: {
            name: country.name,
            code: country.code,
         },
      });

      countries.push(createdCountry);
   }

   return countries;
}

async function assignCountriesToEvents(events: any[], countries: any[]) {
   for (const event of events) {
      // Assign 3-8 random countries to each event
      const countryCount = Math.floor(Math.random() * 6) + 3;
      const shuffledCountries = [...countries].sort(() => 0.5 - Math.random());

      for (let i = 0; i < countryCount && i < shuffledCountries.length; i++) {
         await prisma.countryEvent.create({
            data: {
               eventId: event.id,
               countryId: shuffledCountries[i].id,
            },
         });
      }
   }
}

async function seedHotels(count: number) {
   const hotels = [];

   for (let i = 0; i < count; i++) {
      const hotel = await prisma.hotel.create({
         data: {
            name: faker.company.name() + ' Hotel',
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode(),
            description: faker.lorem.paragraph(),
            capacity: Math.floor(Math.random() * 300) + 50,
            latitude: Number.parseFloat(faker.location.latitude() as any),
            longitude: Number.parseFloat(faker.location.longitude() as any),
            visibility: Math.random() > 0.1, // 90% visible
         },
      });

      hotels.push(hotel);
   }

   return hotels;
}

main()
   .then(async () => {
      await prisma.$disconnect();
   })
   .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
   });

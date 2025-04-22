import {
   PrismaClient,
   Role,
   EventStatus,
   SessionType,
   PartnerType,
   QRCodeType,
   InvoiceStatus,
   InviteStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
   console.log('🌱 Starting seeding process...');

   // Clear existing data
   await clearDatabase();

   // Create users with different roles
   const users = await createUsers(10);
   console.log(`✅ Created ${users.length} users`);

   // Create organizations (some linked to users)
   const organizations = await createOrganizations(5, users);
   console.log(`✅ Created ${organizations.length} organizations`);

   // Create countries
   const countries = await createCountries();
   console.log(`✅ Created ${countries.length} countries`);

   // Create events for organizations
   const events = await createEvents(15, organizations, countries);
   console.log(`✅ Created ${events.length} events`);

   // Create speakers
   const speakers = await createSpeakers(20);
   console.log(`✅ Created ${speakers.length} speakers`);

   // Create side event items
   await createSideEventItems(30, events, speakers);
   console.log(`✅ Created side event items`);

   // Create locations
   const locations = await createLocations(10);
   console.log(`✅ Created ${locations.length} locations`);

   // Assign locations to events
   await assignLocationsToEvents(events, locations);
   console.log(`✅ Assigned locations to events`);

   // Create partners
   const partners = await createPartners(15);
   console.log(`✅ Created ${partners.length} partners`);

   // Assign partners to events
   await assignPartnersToEvents(events, partners);
   console.log(`✅ Assigned partners to events`);

   // Create QR codes
   await createQRCodes(20, events);
   console.log(`✅ Created QR codes`);

   // Create clients
   const clients = await createClients(25);
   console.log(`✅ Created ${clients.length} clients`);

   // Assign clients to events and create invoices
   await assignClientsAndCreateInvoices(events, clients);
   console.log(`✅ Assigned clients to events and created invoices`);

   // Create invites
   await createInvites(50, events, countries);
   console.log(`✅ Created invites`);

   // Create hotels
   await createHotels(8);
   console.log(`✅ Created hotels`);

   console.log('✨ Seeding completed successfully!');
}

async function clearDatabase() {
   // Delete in reverse order of dependencies
   await prisma.countryInvite.deleteMany({});
   await prisma.countryEvent.deleteMany({});
   await prisma.invite.deleteMany({});
   await prisma.qRCode.deleteMany({});
   await prisma.invoice.deleteMany({});
   await prisma.client.deleteMany({});
   await prisma.partner.deleteMany({});
   await prisma.location.deleteMany({});
   await prisma.sideEventItem.deleteMany({});
   await prisma.speaker.deleteMany({});
   await prisma.event.deleteMany({});
   await prisma.hotel.deleteMany({});
   await prisma.country.deleteMany({});
   await prisma.organisation.deleteMany({});
   await prisma.user.deleteMany({});
}

async function createUsers(count: number) {
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

   // Create one organizer user
   const organizerUser = await prisma.user.create({
      data: {
         name: 'Organizer User',
         email: 'organizer@example.com',
         password: 'password123', // In a real app, this would be hashed
         number: faker.phone.number(),
         role: Role.ORGANISER,
         emailVerified: faker.date.past(),
      },
   });
   users.push(organizerUser);

   // Create regular users
   for (let i = 0; i < count - 2; i++) {
      const user = await prisma.user.create({
         data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
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

async function createOrganizations(count: number, users: any[]) {
   const organizations = [];

   // Assign some organizations to users
   const usersForOrgs = [...users]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

   for (let i = 0; i < count; i++) {
      const organization = await prisma.organisation.create({
         data: {
            companyName: faker.company.name(),
            email: faker.internet.email(),
            logoUrl: Math.random() > 0.3 ? faker.image.url() : null,
            website: Math.random() > 0.3 ? faker.internet.url() : null,
            numberCompany: faker.phone.number(),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            userId: i < usersForOrgs.length ? usersForOrgs[i].id : null,
         },
      });
      organizations.push(organization);
   }

   return organizations;
}

async function createCountries() {
   const countryData = [
      { name: 'United States', code: 'US' },
      { name: 'United Kingdom', code: 'GB' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'Japan', code: 'JP' },
      { name: 'Australia', code: 'AU' },
      { name: 'Canada', code: 'CA' },
      { name: 'Brazil', code: 'BR' },
      { name: 'India', code: 'IN' },
      { name: 'China', code: 'CN' },
   ];

   const countries = [];

   for (const country of countryData) {
      const createdCountry = await prisma.country.create({
         data: country,
      });
      countries.push(createdCountry);
   }

   return countries;
}

async function createEvents(
   count: number,
   organizations: any[],
   countries: any[]
) {
   const events = [];
   const statuses = Object.values(EventStatus);

   for (let i = 0; i < count; i++) {
      const startDate = faker.date.future();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);

      const organization =
         organizations[Math.floor(Math.random() * organizations.length)];

      // Select 1-3 random countries for this event
      const selectedCountries = faker.helpers.arrayElements(
         countries,
         Math.floor(Math.random() * 3) + 1
      );

      const event = await prisma.event.create({
         data: {
            title: faker.company.catchPhrase(),
            description: faker.lorem.paragraphs(2),
            startDate,
            endDate,
            location: faker.location.city() + ', ' + faker.location.country(),
            status: faker.helpers.arrayElement(statuses),
            organisationId: organization.id,
         },
      });

      // Create country-event relationships
      for (const country of selectedCountries) {
         await prisma.countryEvent.create({
            data: {
               eventId: event.id,
               countryId: country.id,
            },
         });
      }

      events.push(event);
   }

   return events;
}

async function createSpeakers(count: number) {
   const speakers = [];

   for (let i = 0; i < count; i++) {
      const speaker = await prisma.speaker.create({
         data: {
            name: faker.person.fullName(),
            organization: faker.company.name(),
            bio: faker.lorem.paragraphs(1),
            title: faker.person.jobTitle(),
            avatar: Math.random() > 0.3 ? faker.image.avatar() : null,
         },
      });
      speakers.push(speaker);
   }

   return speakers;
}

async function createSideEventItems(
   count: number,
   events: any[],
   speakers: any[]
) {
   const sessionTypes = Object.values(SessionType);

   for (let i = 0; i < count; i++) {
      const event = events[Math.floor(Math.random() * events.length)];
      const eventDate = new Date(event.startDate);
      eventDate.setHours(Math.floor(Math.random() * 8) + 9); // 9 AM to 5 PM

      // Select 1-3 random speakers for this side event
      const selectedSpeakers = faker.helpers.arrayElements(
         speakers,
         Math.floor(Math.random() * 3) + 1
      );

      const sideEventItem = await prisma.sideEventItem.create({
         data: {
            title: faker.company.catchPhrase(),
            description: faker.lorem.paragraph(),
            date: eventDate,
            time: `${eventDate.getHours()}:${eventDate
               .getMinutes()
               .toString()
               .padStart(2, '0')}`,
            type: faker.helpers.arrayElement(sessionTypes),
            location: faker.location.city(),
            eventId: event.id,
         },
      });

      // Connect speakers to the side event item
      for (const speaker of selectedSpeakers) {
         await prisma.sideEventItem.update({
            where: { id: sideEventItem.id },
            data: {
               speakers: {
                  connect: { id: speaker.id },
               },
            },
         });
      }

      // Also connect these speakers to the main event
      await prisma.event.update({
         where: { id: event.id },
         data: {
            speakers: {
               connect: selectedSpeakers.map((speaker) => ({ id: speaker.id })),
            },
         },
      });
   }
}

async function createLocations(count: number) {
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
            latitude: parseFloat(faker.location.latitude() as any),
            longitude: parseFloat(faker.location.longitude() as any),
            visibility: Math.random() > 0.2,
         },
      });
      locations.push(location);
   }

   return locations;
}

async function assignLocationsToEvents(events: any[], locations: any[]) {
   for (const event of events) {
      // Assign 1-2 locations to each event
      const selectedLocations = faker.helpers.arrayElements(
         locations,
         Math.floor(Math.random() * 2) + 1
      );

      await prisma.event.update({
         where: { id: event.id },
         data: {
            locations: {
               connect: selectedLocations.map((location) => ({
                  id: location.id,
               })),
            },
         },
      });
   }
}

async function createPartners(count: number) {
   const partners = [];
   const partnerTypes = Object.values(PartnerType);
   const tiers = ['Platinum', 'Gold', 'Silver', 'Bronze'];

   for (let i = 0; i < count; i++) {
      const partner = await prisma.partner.create({
         data: {
            name: faker.company.name(),
            type: faker.helpers.arrayElement(partnerTypes),
            website: Math.random() > 0.2 ? faker.internet.url() : null,
            description: faker.lorem.paragraph(),
            logo: Math.random() > 0.2 ? faker.image.url() : null,
            tier: faker.helpers.arrayElement(tiers),
            visibility: Math.random() > 0.1,
         },
      });
      partners.push(partner);
   }

   return partners;
}

async function assignPartnersToEvents(events: any[], partners: any[]) {
   for (const event of events) {
      // Assign 2-5 partners to each event
      const selectedPartners = faker.helpers.arrayElements(
         partners,
         Math.floor(Math.random() * 4) + 2
      );

      await prisma.event.update({
         where: { id: event.id },
         data: {
            partners: {
               connect: selectedPartners.map((partner) => ({ id: partner.id })),
            },
         },
      });
   }
}

async function createQRCodes(count: number, events: any[]) {
   const qrCodeTypes = Object.values(QRCodeType);
   const colors = ['#000000', '#0000FF', '#FF0000', '#008000', '#800080'];

   for (let i = 0; i < count; i++) {
      const type = faker.helpers.arrayElement(qrCodeTypes);
      let content = '';

      // Generate appropriate content based on QR code type
      switch (type) {
         case 'URL':
            content = faker.internet.url();
            break;
         case 'TEXT':
            content = faker.lorem.sentence();
            break;
         case 'EMAIL':
            content = `mailto:${faker.internet.email()}`;
            break;
         case 'PHONE':
            content = `tel:${faker.phone.number()}`;
            break;
         case 'SMS':
            content = `sms:${faker.phone.number()}?body=${encodeURIComponent(
               faker.lorem.sentence()
            )}`;
            break;
         case 'WIFI':
            content = `WIFI:S:${faker.internet.domainWord()};T:WPA;P:${faker.internet.password()};;`;
            break;
         case 'VCARD':
            content = `BEGIN:VCARD\nVERSION:3.0\nN:${faker.person.lastName()};${faker.person.firstName()}\nFN:${faker.person.fullName()}\nORG:${faker.company.name()}\nTITLE:${faker.person.jobTitle()}\nTEL:${faker.phone.number()}\nEMAIL:${faker.internet.email()}\nEND:VCARD`;
            break;
      }

      await prisma.qRCode.create({
         data: {
            name: `${type} QR Code ${i + 1}`,
            type,
            content,
            description: faker.lorem.sentence(),
            foregroundColor: faker.helpers.arrayElement(colors),
            backgroundColor: '#FFFFFF',
            eventId:
               Math.random() > 0.2
                  ? events[Math.floor(Math.random() * events.length)].id
                  : null,
         },
      });
   }
}

async function createClients(count: number) {
   const clients = [];

   for (let i = 0; i < count; i++) {
      const client = await prisma.client.create({
         data: {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            company: Math.random() > 0.3 ? faker.company.name() : null,
            address:
               Math.random() > 0.5 ? faker.location.streetAddress() : null,
            city: Math.random() > 0.5 ? faker.location.city() : null,
            country: Math.random() > 0.5 ? faker.location.country() : null,
            notes: Math.random() > 0.7 ? faker.lorem.paragraph() : null,
         },
      });
      clients.push(client);
   }

   return clients;
}

async function assignClientsAndCreateInvoices(events: any[], clients: any[]) {
   const invoiceStatuses = Object.values(InvoiceStatus);

   for (const event of events) {
      // Assign 3-8 clients to each event
      const selectedClients = faker.helpers.arrayElements(
         clients,
         Math.floor(Math.random() * 6) + 3
      );

      await prisma.event.update({
         where: { id: event.id },
         data: {
            clients: {
               connect: selectedClients.map((client) => ({ id: client.id })),
            },
         },
      });

      // Create invoices for some of the clients
      for (const client of selectedClients) {
         if (Math.random() > 0.3) {
            const dueDate = faker.date.future();

            await prisma.invoice.create({
               data: {
                  number: `INV-${faker.string.alphanumeric(6).toUpperCase()}`,
                  amount: parseFloat(
                     faker.finance.amount({ min: 100, max: 5000, dec: 2 })
                  ),
                  status: faker.helpers.arrayElement(invoiceStatuses),
                  dueDate,
                  clientId: client.id,
                  eventId: event.id,
               },
            });
         }
      }
   }
}

async function createInvites(count: number, events: any[], countries: any[]) {
   const inviteStatuses = Object.values(InviteStatus);

   for (let i = 0; i < count; i++) {
      const event = events[Math.floor(Math.random() * events.length)];
      const expiresAt = faker.date.future();

      // Select 1-2 random countries for this invite
      const selectedCountries = faker.helpers.arrayElements(
         countries,
         Math.floor(Math.random() * 2) + 1
      );

      const invite = await prisma.invite.create({
         data: {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            status: faker.helpers.arrayElement(inviteStatuses),
            token: faker.string.uuid(),
            expiresAt,
            message: Math.random() > 0.5 ? faker.lorem.paragraph() : null,
            eventId: event.id,
         },
      });

      // Create country-invite relationships
      for (const country of selectedCountries) {
         await prisma.countryInvite.create({
            data: {
               inviteId: invite.id,
               countryId: country.id,
            },
         });
      }
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
            capacity: Math.floor(Math.random() * 200) + 50,
            latitude: parseFloat(faker.location.latitude() as any),
            longitude: parseFloat(faker.location.longitude() as any),
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

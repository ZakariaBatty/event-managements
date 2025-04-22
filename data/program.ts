export const programData = {
  sideEvent: [
    {
      date: "05 Février 2025",
      items: [
        {
          time: "14h00 - 16h00",
          type: "MASTER_CLASS",
          title: "MASTER CLASS:",
          show: true,
          description: "Elevage de la crevette",
          speakers: [
            {
              name: "Lorenzo M. Juarez",
              pdfUrl: "/programmes/speakers/Lorenzo-m-juarez.jpg",
              organization: "Banque mondiale",
            },
          ],
        },
        {
          time: "16h00 - 17h00",
          type: "SIDE_EVENT",
          title: "SIDE EVENT :",
          show: true,
          description: "Aquaculture et Finance Bleue : Catalyseurs du Développement des chaines de valeurs",
          speakers: [
            {
              name: "Pierre FAILLER",
              pdfUrl: "/programmes/speakers/Pierre-FAILLER.jpg",
              organization: "Banque mondiale",
              title: "Quelles nouvelles voies pour le financement des activités de l'aquaculture",
            },
            {
              name: "Mourabit Said",
              pdfUrl: "/programmes/speakers/Mourabit-Said.jpg",
              organization: "Banque Islamique de Développement",
              title: "La chaine de valeur aquacole, une contribution à la sécurité alimentaire",
            },
            {
              name: "Siham FELLAHI",
              pdfUrl: "",
              organization: "Ministère de l'Économie et des Finances",
              title: "Les clusters côtiers, une voie de développement de l'économie Bleue et de l'aquaculture",
            },
          ],
        },
        {
          time: "17h00 - 18h00",
          type: "MASTER_CLASS",
          title: "MASTER CLASS:",
          show: true,
          description: "Couvrir les risques opérationnels des fermes aquacoles",
          speakers: [
            {
              name: "Mohamed TAHIRI",
              pdfUrl: "/programmes/speakers/Mohamed-tAHIRI.jpg",
              organization: "Assurances Atlantique Sud",
            },
          ],
        },
      ],
    },
    {
      date: "06 Février 2025",
      items: [
        {
          time: "10h30 - 15h00",
          type: "NETWORKING",
          title: "CONFÉRENCE DU SALON HALIEUTIS",
          show: true,
          description: "« L'Aquaculture de Demain : Synergie entre Recherche, Innovation et Développement Durable »",
        },
        {
          time: "15h30 - 17h30",
          type: "SIDE_EVENT",
          title: "SIDE EVENT : FAO – ANDA – ANEF",
          show: true,
          description:
            "La coopération au service de l'innovation et de la recherche dans le secteur de la pêche et de l'aquaculture",
        },
      ],
    },
    {
      date: "07 Février 2025",
      items: [
        {
          time: "10h00 - 11h00",
          type: "MASTER_CLASS",
          title: "MASTER CLASS:",
          show: true,
          description: "Techniques de la plongée sous-marine pour les opérations aquacoles",
          speakers: [
            {
              name: "Taha Mohamed",
              pdfUrl: "/programmes/speakers/Taha-Mohamed.jpg",
              organization: "Université Ibn Zohr-Agadir",
            },
          ],
        },
        {
          time: "11h00 - 13h00",
          type: "MASTER_CLASS",
          title: "MASTER CLASS:",
          show: true,
          description: "Elevage de la crevette",
          speakers: [
            {
              name: "Lorenzo M. Juarez",
              pdfUrl: "/programmes/speakers/Lorenzo-m-juarez.jpg",
              organization: "Banque mondiale",
            },
          ],
        },
        {
          time: "13h00 - 15h00",
          type: "SHOWCASE",
          title: "SHOWCASE :",
          show: true,
          description: "Aquaculture et innovation, les nouvelles voies pour l'aquaculture",
          speakers: [
            {
              name: "Nir Tzohari",
              pdfUrl: "/programmes/speakers/Nir-Tzohari.jpg",
              organization: "Aquamanager",
              title: "L'intelligence artificielle au service de l'aquaculture",
            },
            {
              name: "Ralf Klis",
              pdfUrl: "/programmes/speakers/Ralf-Klis.jpg",
              organization: "Tonalli Moana",
              title: "L'intelligence artificielle en aquaculture 'Hands-on session'",
            },
            {
              name: "Seth Coan",
              pdfUrl: "/programmes/speakers/Seth-Coan.jpg",
              organization: "Baraka Industrie",
              title: "Osmose inverse des eaux saumâtres (BWRO) et solutions intégrées de gestion de la saumure",
            },
          ],
        },
        {
          time: "15h30 - 16h30",
          type: "SHOWCASE",
          title: "SHOWCASE :",
          show: false,
          description: "L'expérience norvégienne en aquaculture, leçons et opportunités pour les producteurs marocains",
          speakers: [
            {
              name: "H.E. Mr. Larsen Sjur",
              pdfUrl: "",
              organization: "Ambassadeur de la Norvège au Maroc",
            },
            {
              name: "Mme Majida MAAROUF",
              pdfUrl: "",
              organization: "ANDA",
            },
            {
              name: "Mr. Jan-Helge Dahl",
              pdfUrl: "",
              organization: "Alta Mar",
            },
          ],
        },
        {
          time: "16h30 - 17h30",
          type: "ROUNDTABLE",
          title: "ROUNDTABLE :",
          show: true,
          description: "Emergence de l'aquaculture en Afrique, quelles opportunités?",
        },
      ],
    },
    {
      date: "08 Février 2025",
      items: [
        {
          time: "10h00 - 12h00",
          type: "MASTER_CLASS",
          title: "MASTER CLASS:",
          show: true,
          description: "Elevage de la crevette",
          speakers: [
            {
              name: "Lorenzo M. Juarez",
              pdfUrl: "/programmes/speakers/LorenzoMJuarez.jpg",
              organization: "Banque mondiale",
            },
          ],
        },
      ],
    },
  ],
}

export const speakersData = programData.sideEvent.flatMap((day) =>
  day.items.flatMap((item) =>
    item.speakers
      ? item.speakers.map((speaker) => ({
          ...speaker,
          eventTitle: item.description,
          eventType: item.type,
          eventTime: item.time,
          eventDate: day.date,
        }))
      : [],
  ),
)

export const locationData = {
  name: "Salon Halieutis",
  address: "Parc des Expositions, Agadir, Maroc",
  coordinates: "30.4278° N, 9.5981° W",
  mapUrl: "https://maps.google.com/?q=Parc+des+Expositions+Agadir",
}

export const networkData = {
  name: "EventWiFi",
  password: "Aquaculture2025",
  available: true,
}

export const hotelData = [
  {
    name: "Hôtel Royal Atlas",
    stars: 5,
    description: "Hôtel de luxe avec vue sur la mer",
    address: "Boulevard 20 Août, Agadir 80000, Maroc",
    website: "https://www.hotelsatlas.com/fr/hotel-royal-atlas-agadir",
    distance: "2.5 km du salon",
  },
  {
    name: "Ibis Agadir",
    stars: 3,
    description: "Hôtel économique proche du centre-ville",
    address: "Avenue Hassan II, Agadir 80000, Maroc",
    website: "https://all.accor.com/hotel/5211/index.fr.shtml",
    distance: "3.2 km du salon",
  },
  {
    name: "Riu Palace Tikida Agadir",
    stars: 5,
    description: "Resort tout compris avec piscines et spa",
    address: "Chemin des Dunes, Agadir 80000, Maroc",
    website: "https://www.riu.com/fr/hotel/maroc/agadir/hotel-riu-palace-tikida-agadir/",
    distance: "4 km du salon",
  },
]

export const aboutData = {
  title: "Salon Halieutis 2025",
  subtitle: "L'Aquaculture de Demain",
  description:
    "Le Salon Halieutis est un événement international dédié aux secteurs de la pêche, de l'aquaculture et de la valorisation des produits de la mer. Cette édition 2025 met l'accent sur l'innovation et le développement durable dans l'aquaculture, réunissant experts, chercheurs, industriels et décideurs du monde entier pour partager leurs connaissances et expériences.",
  organizers: [
    "Ministère de l'Agriculture, de la Pêche Maritime, du Développement Rural et des Eaux et Forêts",
    "Agence Nationale pour le Développement de l'Aquaculture (ANDA)",
  ],
  edition: "7ème édition",
  dates: "05 - 08 Février 2025",
}

export const partnersData = [
  {
    name: "Ministère de l'Agriculture",
    logo: "/partners/ministere-agriculture.png",
    website: "https://www.agriculture.gov.ma/",
  },
  {
    name: "ANDA",
    logo: "/partners/anda.png",
    website: "https://www.anda.gov.ma/",
  },
  {
    name: "FAO",
    logo: "/partners/fao.png",
    website: "https://www.fao.org/",
  },
  {
    name: "Banque Mondiale",
    logo: "/partners/world-bank.png",
    website: "https://www.worldbank.org/",
  },
]

export const notificationsData = [
  {
    id: 1,
    title: "Ouverture du Salon",
    message: "Le Salon Halieutis ouvre ses portes aujourd'hui à 9h00. Bienvenue à tous les participants!",
    date: "05 Février 2025",
    read: false,
  },
  {
    id: 2,
    title: "Master Class: Élevage de la crevette",
    message: "Rappel: La Master Class sur l'élevage de la crevette commence à 14h00 dans la salle Conférence A.",
    date: "05 Février 2025",
    read: true,
  },
  {
    id: 3,
    title: "Modification d'horaire",
    message: "La table ronde sur l'émergence de l'aquaculture en Afrique est reportée à 17h00 au lieu de 16h30.",
    date: "07 Février 2025",
    read: false,
  },
]

export const qrCodeData = [
  {
    title: "Programme Complet",
    description: "Téléchargez le programme détaillé du salon",
    qrCodeUrl: "/placeholder.svg?height=200&width=200&text=QR-Programme",
    fileType: "PDF",
    fileSize: "2.4 MB",
  },
  {
    title: "Plan du Salon",
    description: "Plan interactif des stands et salles de conférence",
    qrCodeUrl: "/placeholder.svg?height=200&width=200&text=QR-Plan",
    fileType: "PDF",
    fileSize: "1.8 MB",
  },
  {
    title: "Liste des Exposants",
    description: "Consultez la liste complète des exposants",
    qrCodeUrl: "/placeholder.svg?height=200&width=200&text=QR-Exposants",
    fileType: "PDF",
    fileSize: "3.1 MB",
  },
  {
    title: "Guide du Visiteur",
    description: "Informations pratiques pour votre visite",
    qrCodeUrl: "/placeholder.svg?height=200&width=200&text=QR-Guide",
    fileType: "PDF",
    fileSize: "4.2 MB",
  },
]

export const floorPlanData = {
  title: "Plan du Salon Halieutis 2025",
  imageUrl: "/placeholder.svg?height=800&width=1200&text=Plan+du+Salon",
  zones: [
    {
      name: "Hall A - Pêche",
      description: "Stands des entreprises du secteur de la pêche",
      color: "#3B82F6", // blue
    },
    {
      name: "Hall B - Aquaculture",
      description: "Stands des entreprises du secteur de l'aquaculture",
      color: "#10B981", // green
    },
    {
      name: "Hall C - Valorisation",
      description: "Stands des entreprises de valorisation des produits de la mer",
      color: "#F59E0B", // amber
    },
    {
      name: "Hall D - Institutions",
      description: "Stands des institutions et organismes publics",
      color: "#8B5CF6", // purple
    },
    {
      name: "Hall E - Pavillon Aquacole",
      description: "Espace dédié aux conférences et side events",
      color: "#004258", // primary blue
    },
  ],
  rooms: [
    {
      name: "Salle Conférence A",
      capacity: "200 personnes",
      location: "Hall E, 1er étage",
    },
    {
      name: "Salle Conférence B",
      capacity: "150 personnes",
      location: "Hall E, 1er étage",
    },
    {
      name: "Espace Master Class",
      capacity: "80 personnes",
      location: "Hall E, rez-de-chaussée",
    },
    {
      name: "Espace Networking",
      capacity: "100 personnes",
      location: "Hall E, rez-de-chaussée",
    },
  ],
  facilities: [
    "Restauration - Hall C, rez-de-chaussée",
    "Toilettes - Disponibles dans chaque hall",
    "Premiers secours - Hall D, rez-de-chaussée",
    "Point information - Entrée principale",
    "Vestiaire - Entrée principale",
  ],
}

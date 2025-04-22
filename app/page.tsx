"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Sidebar } from "@/components/sidebar"
import { SpeakerCard } from "@/components/speaker-card"
import { AnimatedBackground } from "@/components/animated-background"
import { SearchFilter } from "@/components/search-filter"
import { CalendarButton } from "@/components/calendar-button"
import { CountdownTimer } from "@/components/countdown-timer"
import { FloatingActionButton } from "@/components/floating-action-button"
import { ProgramCard } from "@/components/program-card"
import { QRCodeCard, QRCodeDetailCard, FloorPlanLegend } from "@/components/qr-code-card"
import { Calendar, MapPin, Info, Wifi, Users, Bell, Hotel, Mic, Download, QrCode } from "lucide-react"
import {
  programData,
  speakersData,
  locationData,
  networkData,
  aboutData,
  partnersData,
  notificationsData,
  hotelData,
  qrCodeData,
  floorPlanData,
} from "@/data/program"

export default function Home() {
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showSpeakerDetail, setShowSpeakerDetail] = useState(false)
  const [showPartnerDetail, setShowPartnerDetail] = useState(false)
  const [showQRCodeDetail, setShowQRCodeDetail] = useState(false)
  const [showFloorPlan, setShowFloorPlan] = useState(false)
  const [filteredSpeakers, setFilteredSpeakers] = useState(speakersData)
  const [filteredProgram, setFilteredProgram] = useState(programData.sideEvent)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Check on initial load
    checkMobile()

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const handleCardClick = (type: string, item: any = null) => {
    setActiveSidebar(type)
    setSelectedItem(item)
    setShowSpeakerDetail(false)
    setShowPartnerDetail(false)
    setShowQRCodeDetail(false)
    setShowFloorPlan(false)
  }

  const closeSidebar = () => {
    setActiveSidebar(null)
    setSelectedItem(null)
    setShowSpeakerDetail(false)
    setShowPartnerDetail(false)
    setShowQRCodeDetail(false)
    setShowFloorPlan(false)
  }

  const handleSpeakerClick = (speaker: any) => {
    // If the speaker is clicked from the program, we need to find the full speaker data
    const fullSpeaker = speakersData.find((s) => s.name === speaker.name) || speaker

    // Set the selected item with all necessary data
    setSelectedItem({
      ...fullSpeaker,
      // Ensure we have event information from the program if available
      eventTitle: speaker.eventTitle || fullSpeaker.eventTitle,
      eventType: speaker.eventType || fullSpeaker.eventType,
      eventTime: speaker.eventTime || fullSpeaker.eventTime,
      eventDate: speaker.eventDate || fullSpeaker.eventDate,
    })

    // Change the active sidebar to speakers if it's not already
    if (activeSidebar !== "speakers") {
      setActiveSidebar("speakers")
    }

    // Show the speaker detail view
    setShowSpeakerDetail(true)
  }

  const handlePartnerClick = (partner: any) => {
    setSelectedItem(partner)
    setShowPartnerDetail(true)
  }

  const handleQRCodeClick = (qrCode: any) => {
    setSelectedItem(qrCode)
    setShowQRCodeDetail(true)
  }

  const handleFloorPlanClick = () => {
    setShowFloorPlan(true)
  }

  const handleBackFromDetail = () => {
    setShowSpeakerDetail(false)
    setShowPartnerDetail(false)
    setShowQRCodeDetail(false)
    setShowFloorPlan(false)
  }

  const cardItems = [
    {
      title: "Programme",
      description: "Consultez le programme complet de l'événement",
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      type: "program",
      show: true,
    },
    {
      title: "Intervenants",
      description: "Découvrez les experts et conférenciers",
      icon: <Mic className="w-8 h-8 text-[#004258]" />,
      type: "speakers",
      show: true,
    },
    {
      title: "Lieu",
      description: "Informations sur le lieu de l'événement",
      icon: <MapPin className="w-8 h-8 text-red-500" />,
      type: "location",
      show: true,
    },
    {
      title: "À propos",
      description: "En savoir plus sur l'événement",
      icon: <Info className="w-8 h-8 text-purple-500" />,
      type: "about",
      show: true,
    },
    {
      title: "Réseau WiFi",
      description: "Connectez-vous au réseau de l'événement",
      icon: <Wifi className="w-8 h-8 text-yellow-500" />,
      type: "network",
      show: true,
    },
    {
      title: "Partenaires",
      description: "Découvrez nos partenaires officiels",
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      type: "partners",
      show: true,
    },
    {
      title: "Notifications",
      description: "Restez informé des dernières actualités",
      icon: <Bell className="w-8 h-8 text-orange-500" />,
      type: "notifications",
      show: true,
    },
    {
      title: "Hôtels",
      description: "Options d'hébergement à proximité",
      icon: <Hotel className="w-8 h-8 text-teal-500" />,
      type: "hotels",
      show: true,
    },
    {
      title: "QR Codes",
      description: "Scannez pour accéder aux documents",
      icon: <QrCode className="w-8 h-8 text-[#004258]" />,
      type: "qrcodes",
      show: true,
    },
  ]

  const speakerFilterOptions = [
    { label: "Master Class", value: "MASTER_CLASS" },
    { label: "Side Event", value: "SIDE_EVENT" },
    { label: "Showcase", value: "SHOWCASE" },
    { label: "Roundtable", value: "ROUNDTABLE" },
  ]

  const handleFilterSpeakers = useCallback((filtered) => {
    setFilteredSpeakers(filtered)
  }, [])

  const handleFilterProgram = useCallback((filtered) => {
    setFilteredProgram(filtered)
  }, [])

  return (
    <div className="min-h-screen bg-[#f5f9ff]">
      <AnimatedBackground />

      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "py-4"}`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/placeholder.svg?height=40&width=40&text=Logo"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <h1
              className={`font-bold text-[#004258] transition-all duration-300 ${isScrolled ? "text-lg" : "text-xl"}`}
            >
              {aboutData.title}
            </h1>
          </div>
          <div className="hidden md:flex gap-6">
            {cardItems.slice(0, 4).map((item, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(item.type)}
                className="text-sm font-medium text-gray-700 hover:text-[#004258] transition-colors"
              >
                {item.title}
              </button>
            ))}
          </div>
          <button
            className="px-4 py-2 bg-[#004258] text-white rounded-lg text-sm font-medium hover:bg-[#003245] transition-colors"
            onClick={() => handleCardClick("program")}
          >
            Voir le programme
          </button>
        </div>
      </header>

      <div className="pt-24 pb-10 px-4 text-center relative z-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center mb-6">
            <Image
              src="/placeholder.svg?height=120&width=120&text=Logo"
              alt="Logo"
              width={120}
              height={120}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004258] mb-4">{aboutData.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">{aboutData.subtitle}</p>
          <div className="inline-block bg-white px-4 py-2 rounded-full text-amber-600 font-medium shadow-sm">
            {aboutData.dates} • {locationData.name}
          </div>

          <CountdownTimer targetDate="2025-02-05T09:00:00" />

          <div className="flex flex-wrap justify-center gap-4 mt-6"></div>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              className="px-6 py-3 bg-[#004258] text-white rounded-lg font-medium hover:bg-[#003245] transition-colors flex items-center gap-2"
              onClick={() => handleCardClick("program")}
            >
              <Calendar className="h-5 w-5" />
              Voir le programme
            </button>
            <button
              className="px-6 py-3 bg-white text-[#004258] border border-[#004258] rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              onClick={() => handleCardClick("speakers")}
            >
              <Mic className="h-5 w-5" />
              Découvrir les intervenants
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 pb-20 relative z-10">
        <h2 className="text-2xl font-bold text-[#004258] mb-6 text-center">Accès rapide</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cardItems
            .filter((item) => item.show)
            .map((item, index) => (
              <div
                key={index}
                onClick={() => handleCardClick(item.type)}
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-3">{item.icon}</div>
                  <h3 className="font-medium text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-xs text-gray-600 hidden sm:block">{item.description}</p>
                </div>
              </div>
            ))}
        </div>
      </main>

      <FloatingActionButton onSelect={(type) => handleCardClick(type)} />

      {/* Program Sidebar */}
      <Sidebar isOpen={activeSidebar === "program"} onClose={closeSidebar} title="Programme de l'événement" width="60%">
        <div className="bg-[#f5f9ff] min-h-full">
          <div className="text-center py-6 bg-white border-b">
            <h2 className="text-2xl font-bold text-[#004258]">SIDE EVENT</h2>
            <p className="text-amber-600 mt-2">Agadir Du 05 au 08 Février 2025</p>
            <p className="text-gray-700">- Pavillon Aquacole Hall E 63 -</p>
          </div>

          <div className="p-4">
            <SearchFilter
              data={programData.sideEvent}
              onFilter={handleFilterProgram}
              placeholder="Rechercher dans le programme..."
              filterOptions={[
                { label: "Master Class", value: "MASTER_CLASS" },
                { label: "Side Event", value: "SIDE_EVENT" },
                { label: "Showcase", value: "SHOWCASE" },
                { label: "Roundtable", value: "ROUNDTABLE" },
              ]}
            />

            {filteredProgram.map((day, dayIndex) => (
              <ProgramCard key={dayIndex} date={day.date} items={day.items} onSpeakerClick={handleSpeakerClick} />
            ))}
          </div>

          <div className="p-4 bg-white border-t sticky bottom-0 flex justify-between items-center">
            <CalendarButton
              eventTitle={aboutData.title}
              eventDescription={aboutData.description}
              startDate="2025-02-05T09:00:00"
              endDate="2025-02-08T18:00:00"
              location={locationData.address}
            />

            <button
              className="flex items-center gap-2 px-4 py-2 text-[#004258] hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => window.print()}
            >
              <Download className="h-4 w-4" />
              Télécharger le programme
            </button>
          </div>
        </div>
      </Sidebar>

      {/* Speakers Sidebar */}
      <Sidebar
        isOpen={activeSidebar === "speakers"}
        onClose={closeSidebar}
        title={showSpeakerDetail ? selectedItem?.name : "Intervenants"}
        width="50%"
        showBackButton={showSpeakerDetail}
        onBack={handleBackFromDetail}
      >
        {!showSpeakerDetail ? (
          <div className="p-4 sm:p-6 bg-[#f5f9ff]">
            <SearchFilter
              data={speakersData.filter(
                (speaker, index, self) => index === self.findIndex((s) => s.name === speaker.name),
              )}
              onFilter={handleFilterSpeakers}
              placeholder="Rechercher un intervenant..."
              filterOptions={speakerFilterOptions}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
              {filteredSpeakers
                .filter(
                  (speaker, index, self) =>
                    // Remove duplicates based on name
                    index === self.findIndex((s) => s.name === speaker.name),
                )
                .map((speaker, index) => (
                  <SpeakerCard key={index} speaker={speaker} onClick={() => handleSpeakerClick(speaker)} />
                ))}
            </div>
          </div>
        ) : (
          <div className="bg-white h-full">
            <div className="p-6">
              <div className="flex flex-col space-y-6">
                <div className="mx-auto w-48 h-48 relative overflow-hidden rounded-full shadow-lg">
                  <Image
                    src={selectedItem.pdfUrl || "/placeholder.svg?height=300&width=300"}
                    alt={selectedItem.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
                  <p className="text-gray-600">{selectedItem.organization}</p>
                  {selectedItem.title && <p className="mt-2 text-gray-700 italic">"{selectedItem.title}"</p>}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Session</h3>
                    <p className="text-gray-700">{selectedItem.eventTitle}</p>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-600">{selectedItem.eventDate}</span>
                      <span className="text-gray-600">{selectedItem.eventTime}</span>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Type d'événement</h3>
                    <p className="text-gray-700">{selectedItem.eventType}</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900">Biographie</h3>
                    <p className="text-gray-700 mt-2">
                      Expert reconnu dans son domaine, {selectedItem.name} apporte une expérience précieuse et des
                      connaissances approfondies à notre événement. Avec plusieurs années d'expérience chez{" "}
                      {selectedItem.organization}, il/elle a contribué à de nombreux projets innovants.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Sidebar>

      {/* Location Sidebar */}
      <Sidebar isOpen={activeSidebar === "location"} onClose={closeSidebar} title="Lieu de l'événement" width="50%">
        <div className="bg-white h-full">
          <div className="aspect-video relative">
            <Image src="/placeholder.svg?height=400&width=800&text=Map" alt="Map" fill className="object-cover" />
          </div>

          <div className="p-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{locationData.name}</h3>
              <p className="text-gray-700 mb-4">{locationData.address}</p>
              <p className="text-gray-600 text-sm mb-4">Coordonnées: {locationData.coordinates}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={locationData.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#004258] text-white rounded-lg hover:bg-[#003245] transition-colors"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Voir sur Google Maps
                </a>

                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger le plan
                </button>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Comment s'y rendre</h3>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">En voiture</h4>
                  <p className="text-gray-700 mt-1">
                    Parking gratuit disponible sur place. Suivez les indications pour le Parc des Expositions.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">En transport en commun</h4>
                  <p className="text-gray-700 mt-1">Bus lignes 7, 12 et 15 - arrêt "Parc Expo".</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">Depuis l'aéroport</h4>
                  <p className="text-gray-700 mt-1">
                    Taxi disponible (environ 20 minutes de trajet) ou navette spéciale pour l'événement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>

      {/* About Sidebar */}
      <Sidebar isOpen={activeSidebar === "about"} onClose={closeSidebar} title="À propos de l'événement" width="50%">
        <div className="bg-white h-full p-6">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">{aboutData.description}</p>

            <h3 className="text-xl font-bold text-[#004258] mt-6 mb-3">Organisateurs</h3>
            <ul className="list-disc pl-5 space-y-1">
              {aboutData.organizers.map((org, index) => (
                <li key={index} className="text-gray-700">
                  {org}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mt-6 text-sm">
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Édition:</span> {aboutData.edition}
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <span className="font-medium">Dates:</span> {aboutData.dates}
              </div>
            </div>

            <h3 className="text-xl font-bold text-[#004258] mt-8 mb-3">Objectifs</h3>
            <p className="text-gray-700 leading-relaxed">
              Le Salon Halieutis vise à promouvoir le secteur de la pêche et de l'aquaculture au Maroc et à
              l'international. Il constitue une plateforme d'échange et de partage d'expériences entre les différents
              acteurs du secteur.
            </p>

            <h3 className="text-xl font-bold text-[#004258] mt-8 mb-3">Thématiques</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li className="text-gray-700">Développement durable de l'aquaculture</li>
              <li className="text-gray-700">Innovation et recherche dans le secteur halieutique</li>
              <li className="text-gray-700">Valorisation des produits de la mer</li>
              <li className="text-gray-700">Coopération internationale</li>
              <li className="text-gray-700">Formation et renforcement des capacités</li>
            </ul>

            <div className="mt-8 flex justify-center">
              <CalendarButton
                eventTitle={aboutData.title}
                eventDescription={aboutData.description}
                startDate="2025-02-05T09:00:00"
                endDate="2025-02-08T18:00:00"
                location={locationData.address}
              />
            </div>
          </div>
        </div>
      </Sidebar>

      {/* Network Sidebar */}
      <Sidebar isOpen={activeSidebar === "network"} onClose={closeSidebar} title="Réseau WiFi" width="40%">
        <div className="bg-white h-full">
          <div className="p-6 text-center">
            <div className="bg-gray-100 p-8 rounded-lg">
              <Wifi className="w-16 h-16 mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">{networkData.name}</h3>
              <div className="bg-white p-3 rounded-md mb-4 border">
                <p className="font-mono text-lg">{networkData.password}</p>
              </div>
              <p className="text-sm text-gray-600">
                {networkData.available
                  ? "Le réseau est disponible dans tout le salon"
                  : "Le réseau sera disponible prochainement"}
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Instructions de connexion</h3>

              <div className="space-y-4 text-left">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">1. Recherchez le réseau WiFi</h4>
                  <p className="text-gray-700 mt-1">
                    Ouvrez les paramètres WiFi de votre appareil et recherchez le réseau "{networkData.name}".
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">2. Entrez le mot de passe</h4>
                  <p className="text-gray-700 mt-1">Utilisez le mot de passe indiqué ci-dessus pour vous connecter.</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900">3. Acceptez les conditions</h4>
                  <p className="text-gray-700 mt-1">
                    Une page de connexion peut s'ouvrir. Acceptez les conditions d'utilisation pour finaliser la
                    connexion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Sidebar>

      {/* Partners Sidebar */}
      <Sidebar
        isOpen={activeSidebar === "partners"}
        onClose={closeSidebar}
        title={showPartnerDetail ? selectedItem?.name : "Nos Partenaires"}
        width="50%"
        showBackButton={showPartnerDetail}
        onBack={handleBackFromDetail}
      >
        {!showPartnerDetail ? (
          <div className="bg-white h-full p-4 sm:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {partnersData.map((partner, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                  onClick={() => handlePartnerClick(partner)}
                >
                  <div className="w-16 h-16 sm:w-24 sm:h-24 relative mb-3 sm:mb-4">
                    <Image
                      src={partner.logo || "/placeholder.svg?height=100&width=100"}
                      alt={partner.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-center font-medium text-sm sm:text-base text-gray-900">{partner.name}</h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white h-full p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-40 h-40 relative mb-4">
                <Image
                  src={selectedItem.logo || "/placeholder.svg?height=200&width=200"}
                  alt={selectedItem.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{selectedItem.name}</h2>
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
              </p>

              <div className="mt-6 flex justify-center">
                <a
                  href={selectedItem.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-[#004258] text-white rounded-lg hover:bg-[#003245] transition-colors"
                >
                  Visiter le site web
                </a>
              </div>
            </div>
          </div>
        )}
      </Sidebar>

      {/* Notifications Sidebar */}
      <Sidebar isOpen={activeSidebar === "notifications"} onClose={closeSidebar} title="Notifications" width="40%">
        <div className="bg-white h-full">
          <div className="divide-y">
            {notificationsData.map((notification, index) => (
              <div
                key={index}
                className={`p-4 ${notification.read ? "opacity-70" : ""} hover:bg-gray-50 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${notification.read ? "bg-gray-200" : "bg-blue-100"}`}>
                    <Bell className={`w-5 h-5 ${notification.read ? "text-gray-500" : "text-blue-600"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 border-t sticky bottom-0">
            <button className="w-full py-2 text-center text-[#004258] font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Marquer tout comme lu
            </button>
          </div>
        </div>
      </Sidebar>

      {/* Hotels Sidebar */}
      <Sidebar isOpen={activeSidebar === "hotels"} onClose={closeSidebar} title="Hébergement" width="50%">
        <div className="bg-white h-full">
          {/* Update the hotels grid to have 1 column on mobile, 2 on larger screens */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            {hotelData.map((hotel, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                <div className="aspect-video relative">
                  <Image
                    src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(hotel.name)}`}
                    alt={hotel.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base">{hotel.name}</h3>
                    <div className="flex">
                      {Array.from({ length: hotel.stars }).map((_, i) => (
                        <span key={i} className="text-yellow-400">
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2 text-xs sm:text-sm">{hotel.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">{hotel.address}</p>
                  <p className="text-xs sm:text-sm text-gray-500">Distance: {hotel.distance}</p>
                  <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-[#004258] text-white rounded-lg hover:bg-[#003245] transition-colors"
                    >
                      Réserver
                    </a>
                    <button className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Voir sur la carte
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Sidebar>

      {/* QR Codes Sidebar */}
      <Sidebar
        isOpen={activeSidebar === "qrcodes"}
        onClose={closeSidebar}
        title={showQRCodeDetail ? (showFloorPlan ? "Plan du Salon" : selectedItem?.title) : "QR Codes & Plans"}
        width="60%"
        showBackButton={showQRCodeDetail}
        onBack={handleBackFromDetail}
      >
        {!showQRCodeDetail ? (
          <div className="bg-white h-full p-4 sm:p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-[#004258] mb-4">Documents à télécharger</h3>
              <p className="text-gray-600 mb-4">
                Scannez ces QR codes avec votre appareil mobile pour accéder aux documents du salon.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {qrCodeData.map((qrCode, index) => (
                  <QRCodeCard key={index} qrCode={qrCode} onClick={() => handleQRCodeClick(qrCode)} />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-[#004258] mb-4">Plan du Salon</h3>
              <p className="text-gray-600 mb-4">Consultez le plan interactif du salon pour vous orienter facilement.</p>

              <div
                className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100"
                onClick={handleFloorPlanClick}
              >
                <div className="aspect-video relative overflow-hidden rounded-md mb-3">
                  <Image
                    src={floorPlanData.imageUrl || "/placeholder.svg"}
                    alt="Plan du salon"
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-medium text-gray-900 text-center">{floorPlanData.title}</h3>
                <p className="text-xs text-gray-600 text-center mt-1">Cliquez pour agrandir</p>
              </div>
            </div>
          </div>
        ) : showFloorPlan ? (
          <div className="bg-white h-full p-4 sm:p-6">
            <div className="mb-6">
              <div className="aspect-video relative overflow-hidden rounded-lg shadow-md mb-6">
                <Image
                  src={floorPlanData.imageUrl || "/placeholder.svg"}
                  alt="Plan du salon"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-[#004258] mb-4">Zones du Salon</h3>
                  <div className="space-y-4">
                    {floorPlanData.zones.map((zone, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg border-l-4"
                        style={{ borderColor: zone.color }}
                      >
                        <h4 className="font-medium text-gray-900">{zone.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{zone.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <FloorPlanLegend zones={floorPlanData.zones} />

                  <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Salles de conférence</h3>
                    <div className="space-y-3">
                      {floorPlanData.rooms.map((room, index) => (
                        <div key={index} className="text-sm">
                          <p className="font-medium text-gray-800">{room.name}</p>
                          <p className="text-gray-600 text-xs">
                            {room.location} • {room.capacity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-3">Services</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {floorPlanData.facilities.map((facility, index) => (
                        <li key={index}>{facility}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-center">
                <button className="flex items-center gap-2 px-4 py-2 bg-[#004258] text-white rounded-lg hover:bg-[#003245] transition-colors">
                  <Download className="h-4 w-4" />
                  Télécharger le plan
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white h-full p-4 sm:p-6">
            <div className="max-w-md mx-auto">
              <QRCodeDetailCard qrCode={selectedItem} />
            </div>
          </div>
        )}
      </Sidebar>
    </div>
  )
}

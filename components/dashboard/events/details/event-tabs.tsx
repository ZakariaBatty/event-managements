import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProgramTab } from "./tabs/program-tab"
import { SpeakersTab } from "./tabs/speakers-tab"
import { LocationTab } from "./tabs/location-tab"
import { PartnersTab } from "./tabs/partners-tab"
import { QRCodesTab } from "./tabs/qrcodes-tab"

interface EventTabsProps {
  event: any
  onOpenSlideOver: (content: string, item?: any) => void
  onDeleteItem: (type: string, id: string) => void
  onAddSessionFromProgram: () => void
}

export function EventTabs({ event, onOpenSlideOver, onDeleteItem, onAddSessionFromProgram }: EventTabsProps) {
  if (!event) return null

  return (
    <Tabs defaultValue="program">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="speakers">(1) Speakers</TabsTrigger>
        <TabsTrigger value="program">(2) Program</TabsTrigger>
        <TabsTrigger value="location">(3) Location</TabsTrigger>
        <TabsTrigger value="partners">(4) Partners</TabsTrigger>
        {/* <TabsTrigger value="qrcodes">(5) QR Codes</TabsTrigger> */}
      </TabsList>

      <TabsContent value="program" className="space-y-4 pt-4">
        <ProgramTab
          sessions={event.sessions || []}
          onOpenSlideOver={onOpenSlideOver}
          onDeleteItem={onDeleteItem}
          onAddSessionFromProgram={onAddSessionFromProgram}
        />
      </TabsContent>

      <TabsContent value="speakers" className="space-y-4 pt-4">
        <SpeakersTab speakers={event.speakers || []} onOpenSlideOver={onOpenSlideOver} onDeleteItem={onDeleteItem} />
      </TabsContent>

      <TabsContent value="location" className="space-y-4 pt-4">
        <LocationTab event={event} onOpenSlideOver={onOpenSlideOver} />
      </TabsContent>

      {/* <TabsContent value="partners" className="space-y-4 pt-4">
        <PartnersTab partners={event.partners || []} onOpenSlideOver={onOpenSlideOver} onDeleteItem={onDeleteItem} />
      </TabsContent> */}

      <TabsContent value="qrcodes" className="space-y-4 pt-4">
        <QRCodesTab qrCodes={event.qrCodes || []} onOpenSlideOver={onOpenSlideOver} onDeleteItem={onDeleteItem} />
      </TabsContent>
    </Tabs>
  )
}

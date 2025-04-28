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
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="program">Program</TabsTrigger>
        <TabsTrigger value="speakers">Speakers</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="partners">Partners</TabsTrigger>
        <TabsTrigger value="qrcodes">QR Codes</TabsTrigger>
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

      <TabsContent value="partners" className="space-y-4 pt-4">
        <PartnersTab partners={event.partners || []} onOpenSlideOver={onOpenSlideOver} onDeleteItem={onDeleteItem} />
      </TabsContent>

      <TabsContent value="qrcodes" className="space-y-4 pt-4">
        <QRCodesTab qrCodes={event.qrCodes || []} onOpenSlideOver={onOpenSlideOver} onDeleteItem={onDeleteItem} />
      </TabsContent>
    </Tabs>
  )
}

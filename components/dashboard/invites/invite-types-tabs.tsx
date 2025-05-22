"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InviteTypesTabsProps {
  activeType: string
  types: string[]
  onTypeChange: (type: string) => void
}

export function InviteTypesTabs({ activeType, types, onTypeChange }: InviteTypesTabsProps) {
  return (
    <Tabs defaultValue={activeType} onValueChange={onTypeChange} className="w-full">
      <TabsList className="grid grid-cols-2 md:grid-cols-2 mb-4">
        {types.map((type) => (
          <TabsTrigger key={type} value={type} className="capitalize">
            {type === "all" ? "All Invites" : type === "clients" ? "All Clients" : type === "ivites" ? "All Invites" : type}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    companyName: "Event Manager",
    email: "admin@eventmanager.com",
    phone: "+212 612 345 678",
    address: "123 Main Street, Casablanca, Morocco",
    logo: null,
  })

  const [emailSettings, setEmailSettings] = useState({
    emailNotifications: true,
    eventCreationEmails: true,
    userRegistrationEmails: true,
    invoiceEmails: true,
    emailSignature: "Best regards,\nThe Event Manager Team",
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#004258",
    sidebarCollapsed: false,
    language: "en",
  })

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setGeneralSettings({
      ...generalSettings,
      [name]: value,
    })
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEmailSettings({
      ...emailSettings,
      [name]: value,
    })
  }

  const handleEmailToggle = (name: string, checked: boolean) => {
    setEmailSettings({
      ...emailSettings,
      [name]: checked,
    })
  }

  const handleAppearanceChange = (name: string, value: string) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: value,
    })
  }

  const handleAppearanceToggle = (name: string, checked: boolean) => {
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: checked,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your company information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={generalSettings.companyName}
                  onChange={handleGeneralChange}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={generalSettings.email}
                    onChange={handleGeneralChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={generalSettings.phone} onChange={handleGeneralChange} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" name="address" value={generalSettings.address} onChange={handleGeneralChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">Company Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
                    Logo
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary-light">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Configure email notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Enable Email Notifications</Label>
                <Switch
                  id="emailNotifications"
                  checked={emailSettings.emailNotifications}
                  onCheckedChange={(checked) => handleEmailToggle("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="eventCreationEmails">Event Creation Emails</Label>
                <Switch
                  id="eventCreationEmails"
                  checked={emailSettings.eventCreationEmails}
                  onCheckedChange={(checked) => handleEmailToggle("eventCreationEmails", checked)}
                  disabled={!emailSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="userRegistrationEmails">User Registration Emails</Label>
                <Switch
                  id="userRegistrationEmails"
                  checked={emailSettings.userRegistrationEmails}
                  onCheckedChange={(checked) => handleEmailToggle("userRegistrationEmails", checked)}
                  disabled={!emailSettings.emailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="invoiceEmails">Invoice Emails</Label>
                <Switch
                  id="invoiceEmails"
                  checked={emailSettings.invoiceEmails}
                  onCheckedChange={(checked) => handleEmailToggle("invoiceEmails", checked)}
                  disabled={!emailSettings.emailNotifications}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailSignature">Email Signature</Label>
                <Textarea
                  id="emailSignature"
                  name="emailSignature"
                  value={emailSettings.emailSignature}
                  onChange={handleEmailChange}
                  rows={4}
                  disabled={!emailSettings.emailNotifications}
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary-light">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={appearanceSettings.theme}
                  onValueChange={(value) => handleAppearanceChange("theme", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="primaryColor"
                    name="primaryColor"
                    type="color"
                    value={appearanceSettings.primaryColor}
                    onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <span className="text-sm text-gray-500">{appearanceSettings.primaryColor}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sidebarCollapsed">Default Collapsed Sidebar</Label>
                <Switch
                  id="sidebarCollapsed"
                  checked={appearanceSettings.sidebarCollapsed}
                  onCheckedChange={(checked) => handleAppearanceToggle("sidebarCollapsed", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={appearanceSettings.language}
                  onValueChange={(value) => handleAppearanceChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="ar">Arabic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button className="bg-primary hover:bg-primary-light">Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface UserFormProps {
  user?: any
  mode: "create" | "edit" | "view"
  onSubmit: () => void
  onCancel: () => void
}

export function UserForm({ user, mode, onSubmit, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "viewer",
    status: "active",
    password: "",
    confirmPassword: "",
    phone: "",
    department: "",
    joinDate: null as Date | null,
    avatar: "",
    bio: "",
    address: "",
    city: "",
    country: "",
    permissions: {
      createEvents: false,
      editEvents: false,
      deleteEvents: false,
      manageUsers: false,
      manageClients: false,
      viewReports: true,
    },
  })

  useEffect(() => {
    if (user && (mode === "edit" || mode === "view")) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "viewer",
        status: user.status || "active",
        password: "",
        confirmPassword: "",
        phone: user.phone || "",
        department: user.department || "",
        joinDate: user.joinDate ? new Date(user.joinDate) : null,
        avatar: user.avatar || "",
        bio: user.bio || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "",
        permissions: user.permissions || {
          createEvents: false,
          editEvents: false,
          deleteEvents: false,
          manageUsers: false,
          manageClients: false,
          viewReports: true,
        },
      })
    }
  }, [user, mode])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData({
      ...formData,
      status: checked ? "active" : "inactive",
    })
  }

  const handlePermissionChange = (permission: string, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: checked,
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would call an API to save the user
    console.log("Form data to save:", formData)
    onSubmit()
  }

  const isReadOnly = mode === "view"
  const isNewUser = mode === "create"

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="permissions">Permissions</TabsTrigger>
      </TabsList>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TabsContent value="general" className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar} alt={formData.name} />
              <AvatarFallback className="text-lg bg-primary text-white">
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            {!isReadOnly && (
              <Button type="button" variant="outline" className="h-10">
                <Upload className="mr-2 h-4 w-4" />
                Upload Photo
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                disabled={isReadOnly}
                value={formData.role}
                onValueChange={(value) => handleSelectChange("role", value)}
              >
                <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                disabled={isReadOnly}
                value={formData.department}
                onValueChange={(value) => handleSelectChange("department", value)}
              >
                <SelectTrigger className={isReadOnly ? "bg-gray-50" : ""}>
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="status">Active Status</Label>
            <Switch
              id="status"
              checked={formData.status === "active"}
              onCheckedChange={handleStatusChange}
              disabled={isReadOnly}
            />
          </div>

          {(isNewUser || mode === "edit") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">
                  {isNewUser ? "Password" : "New Password"}{" "}
                  {mode === "edit" && <span className="text-gray-500 text-sm">(leave blank to keep current)</span>}
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isNewUser ? "Enter password" : "Enter new password"}
                  required={isNewUser}
                  className={isReadOnly ? "bg-gray-50" : ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required={isNewUser}
                  className={isReadOnly ? "bg-gray-50" : ""}
                />
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label>Join Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.joinDate && "text-muted-foreground",
                    isReadOnly && "bg-gray-50 pointer-events-none",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.joinDate ? format(formData.joinDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              {!isReadOnly && (
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.joinDate || undefined}
                    onSelect={(date) => setFormData({ ...formData, joinDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              )}
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Enter user bio"
              rows={4}
              readOnly={isReadOnly}
              className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                isReadOnly && "bg-gray-50",
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              readOnly={isReadOnly}
              className={isReadOnly ? "bg-gray-50" : ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
                readOnly={isReadOnly}
                className={isReadOnly ? "bg-gray-50" : ""}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">User Permissions</h3>
            <p className="text-sm text-gray-500">
              Configure what actions this user can perform in the system. These permissions override the default role
              permissions.
            </p>

            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Create Events</Label>
                  <p className="text-sm text-gray-500">Can create new events in the system</p>
                </div>
                <Switch
                  checked={formData.permissions.createEvents}
                  onCheckedChange={(checked) => handlePermissionChange("createEvents", checked)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Edit Events</Label>
                  <p className="text-sm text-gray-500">Can modify existing events</p>
                </div>
                <Switch
                  checked={formData.permissions.editEvents}
                  onCheckedChange={(checked) => handlePermissionChange("editEvents", checked)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Delete Events</Label>
                  <p className="text-sm text-gray-500">Can remove events from the system</p>
                </div>
                <Switch
                  checked={formData.permissions.deleteEvents}
                  onCheckedChange={(checked) => handlePermissionChange("deleteEvents", checked)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Manage Users</Label>
                  <p className="text-sm text-gray-500">Can create, edit, and delete user accounts</p>
                </div>
                <Switch
                  checked={formData.permissions.manageUsers}
                  onCheckedChange={(checked) => handlePermissionChange("manageUsers", checked)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Manage Clients</Label>
                  <p className="text-sm text-gray-500">Can create, edit, and delete client accounts</p>
                </div>
                <Switch
                  checked={formData.permissions.manageClients}
                  onCheckedChange={(checked) => handlePermissionChange("manageClients", checked)}
                  disabled={isReadOnly}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">View Reports</Label>
                  <p className="text-sm text-gray-500">Can access analytics and reports</p>
                </div>
                <Switch
                  checked={formData.permissions.viewReports}
                  onCheckedChange={(checked) => handlePermissionChange("viewReports", checked)}
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button type="submit" className="bg-primary hover:bg-primary-light">
              {mode === "create" ? "Create User" : "Save Changes"}
            </Button>
          )}
        </div>
      </form>
    </Tabs>
  )
}

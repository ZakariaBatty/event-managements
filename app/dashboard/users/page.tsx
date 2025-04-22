"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/dashboard/data-table"
import { SlideOver } from "@/components/dashboard/slide-over"
import { UserForm } from "@/components/dashboard/user-form"
import { PlusCircle, Shield, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UsersPage() {
  const [slideOverOpen, setSlideOverOpen] = useState(false)
  const [slideOverMode, setSlideOverMode] = useState<"create" | "edit" | "view">("create")
  const [selectedUser, setSelectedUser] = useState<any>(null)

  // Mock data for users
  const users = [
    {
      id: "user-001",
      name: "Ahmed Benali",
      email: "ahmed@example.com",
      role: "admin",
      status: "active",
      department: "Management",
      avatar: "",
    },
    {
      id: "user-002",
      name: "Fatima Zahra",
      email: "fatima@example.com",
      role: "manager",
      status: "active",
      department: "Marketing",
      avatar: "",
    },
    {
      id: "user-003",
      name: "Karim Benjelloun",
      email: "karim@example.com",
      role: "editor",
      status: "active",
      department: "Content",
      avatar: "",
    },
    {
      id: "user-004",
      name: "Nadia Tazi",
      email: "nadia@example.com",
      role: "viewer",
      status: "inactive",
      department: "Design",
      avatar: "",
    },
    {
      id: "user-005",
      name: "Youssef Mansouri",
      email: "youssef@example.com",
      role: "editor",
      status: "active",
      department: "IT",
      avatar: "",
    },
  ]

  const columns = [
    {
      key: "name",
      label: "User",
      isTitle: true,
      render: (value: string, item: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarImage src={item.avatar} alt={value} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {value
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-primary">{value}</div>
            <div className="text-sm text-gray-500">{item.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "department",
      label: "Department",
      render: (value: string) => (
        <div className="flex items-center">
          <User className="mr-1 h-4 w-4 text-success" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (value: string) => (
        <div className="flex items-center">
          <Shield className="mr-1 h-4 w-4 text-primary" />
          <Badge
            className={
              value === "admin"
                ? "bg-primary/10 text-primary hover:bg-primary/20"
                : value === "manager"
                  ? "bg-accent/10 text-accent hover:bg-accent/20"
                  : value === "editor"
                    ? "bg-success/10 text-success hover:bg-success/20"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (value: string) => (
        <Badge
          className={
            value === "active"
              ? "bg-success/10 text-success hover:bg-success/20"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }
        >
          {value === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
    },
  ]

  const handleCreateUser = () => {
    setSelectedUser(null)
    setSlideOverMode("create")
    setSlideOverOpen(true)
  }

  const handleEditUser = (user: any) => {
    setSelectedUser(user)
    setSlideOverMode("edit")
    setSlideOverOpen(true)
  }

  const handleViewUser = (user: any) => {
    setSelectedUser(user)
    setSlideOverMode("view")
    setSlideOverOpen(true)
  }

  const handleDeleteUser = (user: any) => {
    // In a real app, you would call an API to delete the user
    console.log("Delete user:", user)
    alert(`User "${user.name}" would be deleted in a real app.`)
  }

  const handleCloseSlideOver = () => {
    setSlideOverOpen(false)
  }

  const handleFormSubmit = () => {
    // In a real app, you would call an API to save the user
    setSlideOverOpen(false)
    alert(`User would be ${slideOverMode === "create" ? "created" : "updated"} in a real app.`)
  }

  return (
    <div className="p-6 space-y-6 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Users
          </h1>
          <p className="text-gray-500 mt-1">Manage your team members and their access</p>
        </div>
        <Button onClick={handleCreateUser} className="btn-modern bg-primary hover:bg-primary-light">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <DataTable
          data={users}
          columns={columns}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
          onView={handleViewUser}
        />
      </div>

      <SlideOver
        open={slideOverOpen}
        onClose={handleCloseSlideOver}
        side="left"
        title={slideOverMode === "create" ? "Add New User" : slideOverMode === "edit" ? "Edit User" : "User Details"}
      >
        <UserForm
          user={selectedUser}
          mode={slideOverMode}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseSlideOver}
        />
      </SlideOver>
    </div>
  )
}

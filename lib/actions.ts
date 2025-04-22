"use server"

import { revalidatePath } from "next/cache"
import { readData, writeData } from "./data-service"

// Generic function to handle form submissions
export async function handleFormSubmission(formData: FormData, entity: string, id?: string) {
  try {
    // Convert FormData to a regular object
    const data: Record<string, any> = {}
    formData.forEach((value, key) => {
      // Handle nested objects with dot notation (e.g., "address.city")
      if (key.includes(".")) {
        const [parent, child] = key.split(".")
        if (!data[parent]) data[parent] = {}
        data[parent][child] = value
      } else {
        data[key] = value
      }
    })

    // Read existing data
    const fileName = `${entity}.json`
    const existingData = await readData<any[]>(fileName)

    let updatedData

    if (id) {
      // Update existing item
      updatedData = existingData.map((item) => (item.id === id ? { ...item, ...data } : item))
    } else {
      // Add new item with a unique ID
      const newId = crypto.randomUUID()
      updatedData = [...existingData, { id: newId, ...data }]
    }

    // Write updated data back to file
    await writeData(fileName, updatedData)

    // Revalidate the path to update the UI
    revalidatePath(`/dashboard/${entity}`)

    return { success: true }
  } catch (error) {
    console.error("Error handling form submission:", error)
    return { success: false, error: "Failed to save data" }
  }
}

// Function to delete an item
export async function deleteItem(entity: string, id: string) {
  try {
    const fileName = `${entity}.json`
    const existingData = await readData<any[]>(fileName)

    const updatedData = existingData.filter((item) => item.id !== id)

    await writeData(fileName, updatedData)

    revalidatePath(`/dashboard/${entity}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting item:", error)
    return { success: false, error: "Failed to delete item" }
  }
}

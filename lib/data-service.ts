import fs from "fs/promises"
import path from "path"

// Base path for data files
const DATA_DIR = path.join(process.cwd(), "data")

// Generic function to read data from a JSON file
export async function readData<T>(fileName: string): Promise<T> {
  try {
    const filePath = path.join(DATA_DIR, fileName)
    const data = await fs.readFile(filePath, "utf8")
    return JSON.parse(data) as T
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error)
    throw new Error(`Failed to read data from ${fileName}`)
  }
}

// Generic function to write data to a JSON file
export async function writeData<T>(fileName: string, data: T): Promise<void> {
  try {
    const filePath = path.join(DATA_DIR, fileName)
    const jsonData = JSON.stringify(data, null, 2)
    await fs.writeFile(filePath, jsonData, "utf8")
  } catch (error) {
    console.error(`Error writing to ${fileName}:`, error)
    throw new Error(`Failed to write data to ${fileName}`)
  }
}

// Function to ensure the data directory exists
export async function ensureDataDir(): Promise<void> {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize data files if they don't exist
export async function initializeDataFiles(): Promise<void> {
  await ensureDataDir()

  const dataFiles = [
    { name: "program.json", defaultData: { sideEvent: [] } },
    { name: "speakers.json", defaultData: [] },
    { name: "location.json", defaultData: {} },
    { name: "about.json", defaultData: {} },
    { name: "network.json", defaultData: {} },
    { name: "partners.json", defaultData: [] },
    { name: "hotels.json", defaultData: [] },
    { name: "qrcodes.json", defaultData: [] },
    { name: "clients.json", defaultData: [] },
    { name: "invoices.json", defaultData: [] },
  ]

  for (const file of dataFiles) {
    const filePath = path.join(DATA_DIR, file.name)
    try {
      await fs.access(filePath)
    } catch {
      await writeData(file.name, file.defaultData)
    }
  }
}

import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")

    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}-${file.name.replace(/\s+/g, "-").toLowerCase()}`
    const filePath = join(uploadsDir, uniqueFilename)

    // Convert the file to a Buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // Write the file to the uploads directory
    await writeFile(filePath, buffer)

    // Return the path to the uploaded file
    const fileUrl = `/uploads/${uniqueFilename}`

    return NextResponse.json({ success: true, fileUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

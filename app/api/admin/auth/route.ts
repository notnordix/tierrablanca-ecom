import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Get admin credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME || ""
    const adminPassword = process.env.ADMIN_PASSWORD || ""

    // Check if credentials match
    if (username === adminUsername && password === adminPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}

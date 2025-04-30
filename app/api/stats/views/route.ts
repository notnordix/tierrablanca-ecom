import { NextResponse } from "next/server"
import { incrementViewCount, getViewCount } from "@/lib/view-counter"

export async function GET() {
  try {
    const count = await getViewCount()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error getting view count:", error)
    return NextResponse.json({ error: "Failed to get view count" }, { status: 500 })
  }
}

export async function POST() {
  try {
    const count = await incrementViewCount()
    return NextResponse.json({ count })
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return NextResponse.json({ error: "Failed to increment view count" }, { status: 500 })
  }
}

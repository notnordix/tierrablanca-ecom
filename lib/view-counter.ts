"use server"

import { query } from "./db"

export async function incrementViewCount(): Promise<number> {
  try {
    await query("CALL increment_view_count()")
    const result = (await query("SELECT count FROM view_counter WHERE id = 1")) as any[]
    return result[0].count
  } catch (error) {
    console.error("Error incrementing view count:", error)
    return 0
  }
}

export async function getViewCount(): Promise<number> {
  try {
    const result = (await query("SELECT count FROM view_counter WHERE id = 1")) as any[]
    return result[0].count
  } catch (error) {
    console.error("Error getting view count:", error)
    return 0
  }
}

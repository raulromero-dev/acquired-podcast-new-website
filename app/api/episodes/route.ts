import { NextResponse } from "next/server"
import { getEpisodesStore } from "@/lib/episodes-store"

// GET - Fetch all episodes (public endpoint)
export async function GET() {
  const { episodes, featuredSlugs } = getEpisodesStore()

  return NextResponse.json({
    episodes,
    featuredSlugs,
  })
}

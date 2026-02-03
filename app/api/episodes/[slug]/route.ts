import { type NextRequest, NextResponse } from "next/server"
import { getEpisodesStore } from "@/lib/episodes-store"

// GET - Fetch single episode by slug (public endpoint)
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { episodes } = getEpisodesStore()

  const episode = episodes.find((ep) => ep.slug === slug)

  if (!episode) {
    return NextResponse.json({ error: "Episode not found" }, { status: 404 })
  }

  return NextResponse.json({ episode })
}

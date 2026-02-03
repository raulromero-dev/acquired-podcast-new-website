import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"
import type { Episode } from "@/lib/episodes-data"
import { getEpisodesStore, updateEpisode, addEpisode, deleteEpisode } from "@/lib/episodes-store"

// GET - Fetch all episodes
export async function GET(request: NextRequest) {
  const session = await verifyAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { episodes, featuredSlugs } = getEpisodesStore()

  return NextResponse.json({
    episodes,
    featuredSlugs,
  })
}

// POST - Create new episode
export async function POST(request: NextRequest) {
  const session = await verifyAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const episode: Episode = await request.json()

    // Generate slug from title if not provided
    if (!episode.slug) {
      episode.slug = episode.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
    }

    const { episodes } = getEpisodesStore()

    // Check for duplicate slug
    if (episodes.some((ep) => ep.slug === episode.slug)) {
      return NextResponse.json({ error: "Episode with this slug already exists" }, { status: 400 })
    }

    addEpisode(episode)

    return NextResponse.json({ success: true, episode })
  } catch (error) {
    return NextResponse.json({ error: "Invalid episode data" }, { status: 400 })
  }
}

// PUT - Update existing episode
export async function PUT(request: NextRequest) {
  const session = await verifyAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const episode: Episode = await request.json()

    if (!updateEpisode(episode)) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, episode })
  } catch (error) {
    return NextResponse.json({ error: "Invalid episode data" }, { status: 400 })
  }
}

// DELETE - Delete episode
export async function DELETE(request: NextRequest) {
  const session = await verifyAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await request.json()

    if (!deleteEpisode(slug)) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

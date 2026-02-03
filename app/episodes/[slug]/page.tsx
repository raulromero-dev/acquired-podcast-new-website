"use client"
import { EpisodeDetailClient } from "./episode-detail-client"

export default async function EpisodeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <EpisodeDetailClient slug={slug} />
}

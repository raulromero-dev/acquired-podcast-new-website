"use client"

import { allEpisodes, type Episode } from "@/lib/episodes-data"

const STORAGE_KEY = "acq-episodes-store"
const FEATURED_KEY = "acq-featured-episodes"

// Get episodes from localStorage or fallback to defaults
export function getStoredEpisodes(): Episode[] {
  if (typeof window === "undefined") return allEpisodes

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Failed to parse stored episodes:", e)
  }
  return allEpisodes
}

// Save episodes to localStorage
export function saveEpisodes(episodes: Episode[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(episodes))
}

// Get a single episode by slug
export function getStoredEpisodeBySlug(slug: string): Episode | undefined {
  const episodes = getStoredEpisodes()
  return episodes.find((ep) => ep.slug === slug)
}

// Update a single episode
export function updateStoredEpisode(episode: Episode) {
  const episodes = getStoredEpisodes()
  const index = episodes.findIndex((ep) => ep.slug === episode.slug)
  if (index !== -1) {
    episodes[index] = episode
    saveEpisodes(episodes)
    return true
  }
  return false
}

// Add a new episode
export function addStoredEpisode(episode: Episode) {
  const episodes = getStoredEpisodes()
  episodes.unshift(episode)
  saveEpisodes(episodes)
}

// Delete an episode
export function deleteStoredEpisode(slug: string) {
  const episodes = getStoredEpisodes()
  const index = episodes.findIndex((ep) => ep.slug === slug)
  if (index !== -1) {
    episodes.splice(index, 1)
    saveEpisodes(episodes)
    return true
  }
  return false
}

// Get featured slugs
export function getStoredFeaturedSlugs(): string[] {
  if (typeof window === "undefined") {
    return ["10-years-of-acquired-with-michael-lewis", "coca-cola", "trader-joes"]
  }

  try {
    const stored = localStorage.getItem(FEATURED_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error("Failed to parse featured slugs:", e)
  }
  return ["10-years-of-acquired-with-michael-lewis", "coca-cola", "trader-joes"]
}

// Save featured slugs
export function saveStoredFeaturedSlugs(slugs: string[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(FEATURED_KEY, JSON.stringify(slugs))
}

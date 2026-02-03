"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import {
  X,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Check,
  AlertCircle,
  Loader2,
  Upload,
  Link,
  ImageIcon,
  Youtube,
} from "lucide-react"
import type { Episode } from "@/lib/episodes-data"

interface EpisodeEditorProps {
  episode: Episode
  isCreating: boolean
  isSaving: boolean
  saveMessage: { type: "success" | "error"; text: string } | null
  onSave: (episode: Episode) => void
  onClose: () => void
}

async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      let { width, height } = img

      // Scale down if wider than maxWidth
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Could not compress image"))
          }
        },
        "image/jpeg",
        quality,
      )
    }
    img.onerror = () => reject(new Error("Could not load image"))
    img.src = URL.createObjectURL(file)
  })
}

function extractYoutubeId(input: string): string {
  if (!input) return ""

  // Common YouTube URL patterns
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/, // Already an ID
  ]

  for (const pattern of patterns) {
    const match = input.match(pattern)
    if (match) {
      return match[1]
    }
  }

  // Return as-is if no pattern matches (user might be typing)
  return input
}

export function EpisodeEditor({ episode, isCreating, isSaving, saveMessage, onSave, onClose }: EpisodeEditorProps) {
  const [formData, setFormData] = useState<Episode>(episode)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [transcriptMode, setTranscriptMode] = useState<"timestamped" | "plain">(
    typeof episode.transcript === "string" ? "plain" : "timestamped",
  )
  const [plainTranscript, setPlainTranscript] = useState<string>(
    typeof episode.transcript === "string" ? episode.transcript : "",
  )
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [youtubeInput, setYoutubeInput] = useState<string>(episode.youtubeId || "") // State for the YouTube input field

  useEffect(() => {
    setFormData(episode)
    setYoutubeInput(episode.youtubeId || "") // Initialize youtubeInput
    if (typeof episode.transcript === "string") {
      setTranscriptMode("plain")
      setPlainTranscript(episode.transcript)
    } else {
      setTranscriptMode("timestamped")
      setPlainTranscript("")
    }
    if (episode.coverImage) {
      setImagePreview(episode.coverImage)
    }
  }, [episode])

  const updateField = <K extends keyof Episode>(field: K, value: Episode[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const slug =
      formData.slug ||
      formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()

    const finalData: Episode = {
      ...formData,
      slug,
      transcript:
        transcriptMode === "plain"
          ? plainTranscript.trim() || undefined
          : formData.transcript && Array.isArray(formData.transcript) && formData.transcript.length > 0
            ? formData.transcript
            : undefined,
    }

    onSave(finalData)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file")
      return
    }

    if (file.size > 20 * 1024 * 1024) {
      setUploadError("Image must be less than 20MB")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const token = localStorage.getItem("admin_session")
      if (!token) {
        throw new Error("Not authenticated")
      }

      let imageBlob: Blob

      // If file is larger than 1MB, compress it
      if (file.size > 1 * 1024 * 1024) {
        console.log("[v0] Compressing image from", (file.size / 1024 / 1024).toFixed(2), "MB")
        imageBlob = await compressImage(file, 1200, 0.8)
        console.log("[v0] Compressed to", (imageBlob.size / 1024 / 1024).toFixed(2), "MB")

        // If still too large, compress more aggressively
        if (imageBlob.size > 3 * 1024 * 1024) {
          console.log("[v0] Still too large, compressing more...")
          imageBlob = await compressImage(file, 800, 0.6)
          console.log("[v0] Compressed to", (imageBlob.size / 1024 / 1024).toFixed(2), "MB")
        }
      } else {
        imageBlob = file
      }

      // Read compressed blob as ArrayBuffer
      const arrayBuffer = await imageBlob.arrayBuffer()

      // Upload raw bytes directly
      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "image/jpeg",
        },
        body: arrayBuffer,
      })

      if (!response.ok) {
        let errorMessage = "Upload failed"
        try {
          const text = await response.text()
          if (text.startsWith("{")) {
            const error = JSON.parse(text)
            errorMessage = error.error || errorMessage
          } else if (
            text.includes("Request Entity Too Large") ||
            text.includes("413") ||
            text.startsWith("Request En")
          ) {
            errorMessage = "File still too large after compression. Please use a smaller image."
          } else {
            errorMessage = text || errorMessage
          }
        } catch {
          errorMessage = "Upload failed - please try a smaller image"
        }
        throw new Error(errorMessage)
      }

      const { url } = await response.json()

      // Update form data with the new URL
      updateField("coverImage", url)
      setImagePreview(url)
    } catch (error) {
      console.error("[v0] Upload error:", error)
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
      handleImageUpload({ target: { files: dataTransfer.files } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const removeImage = () => {
    updateField("coverImage", "")
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleYoutubeChange = (value: string) => {
    setYoutubeInput(value)
    const extractedId = extractYoutubeId(value.trim())
    updateField("youtubeId", extractedId)
  }

  const addTranscriptEntry = () => {
    const current = formData.transcript || []
    updateField("transcript", [...current, { time: "00:00", text: "" }])
  }

  const updateTranscriptEntry = (index: number, field: "time" | "text", value: string) => {
    const current = formData.transcript || []
    const updated = [...current]
    // Ensure the entry is an object before updating
    if (typeof updated[index] === "object" && updated[index] !== null) {
      updated[index] = { ...updated[index], [field]: value } as { time: string; text: string }
      updateField("transcript", updated as Episode["transcript"])
    }
  }

  const removeTranscriptEntry = (index: number) => {
    const current = formData.transcript || []
    updateField(
      "transcript",
      current.filter((_, i) => i !== index),
    )
  }

  const addCarveOut = () => {
    const current = formData.carveOuts || []
    updateField("carveOuts", [...current, { person: "", items: [""] }])
  }

  const updateCarveOut = (index: number, field: "person" | "items", value: string | string[]) => {
    const current = formData.carveOuts || []
    const updated = [...current]
    updated[index] = { ...updated[index], [field]: value }
    updateField("carveOuts", updated)
  }

  const removeCarveOut = (index: number) => {
    const current = formData.carveOuts || []
    updateField(
      "carveOuts",
      current.filter((_, i) => i !== index),
    )
  }

  const addFollowUp = () => {
    const current = formData.followUps || []
    updateField("followUps", [...current, ""])
  }

  const updateFollowUp = (index: number, value: string) => {
    const current = formData.followUps || []
    const updated = [...current]
    updated[index] = value
    updateField("followUps", updated)
  }

  const removeFollowUp = (index: number) => {
    const current = formData.followUps || []
    updateField(
      "followUps",
      current.filter((_, i) => i !== index),
    )
  }

  const addSponsor = () => {
    const current = formData.sponsors || []
    updateField("sponsors", [...current, { name: "", description: "" }])
  }

  const updateSponsor = (index: number, field: "name" | "description", value: string) => {
    const current = formData.sponsors || []
    const updated = [...current]
    updated[index] = { ...updated[index], [field]: value }
    updateField("sponsors", updated)
  }

  const removeSponsor = (index: number) => {
    const current = formData.sponsors || []
    updateField(
      "sponsors",
      current.filter((_, i) => i !== index),
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.02]" />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-black border border-white/[0.08] rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.05] pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <h2 className="text-lg font-medium text-white">{isCreating ? "Create Episode" : "Edit Episode"}</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/50" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="relative p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-130px)]">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="Episode title"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                Company / Guest
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => updateField("company", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="Company name"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="3h 45min"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                Season / Type
              </label>
              <input
                type="text"
                value={formData.season}
                onChange={(e) => updateField("season", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="Fall 2025, ACQ2, Special"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
                Episode Number
              </label>
              <input
                type="text"
                value={formData.episode || ""}
                onChange={(e) => updateField("episode", e.target.value ? e.target.value : undefined)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="e.g., 1, 2, 3 (leave empty for specials)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Date</label>
              <input
                type="text"
                value={formData.date || ""}
                onChange={(e) => updateField("date", e.target.value)}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="December 14, 2025"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Cover Image</label>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageInputMode("url")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  imageInputMode === "url"
                    ? "bg-white/10 text-white border border-white/15"
                    : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] border border-transparent"
                }`}
              >
                <Link className="w-3.5 h-3.5" />
                URL
              </button>
              <button
                type="button"
                onClick={() => setImageInputMode("upload")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  imageInputMode === "upload"
                    ? "bg-white/10 text-white border border-white/15"
                    : "bg-white/[0.03] text-white/50 hover:bg-white/[0.06] border border-transparent"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload
              </button>
            </div>

            {imageInputMode === "url" ? (
              <input
                type="text"
                value={formData.coverImage || ""}
                onChange={(e) => {
                  updateField("coverImage", e.target.value)
                  setImagePreview(e.target.value)
                }}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className={`relative border border-dashed rounded-xl p-5 text-center transition-all ${
                  isUploading
                    ? "border-white/20 bg-white/[0.04]"
                    : "border-white/10 hover:border-white/20 bg-white/[0.02]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 text-white/50 animate-spin" />
                    <p className="text-xs text-white/50">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5">
                    <ImageIcon className="w-6 h-6 text-white/30" />
                    <p className="text-xs text-white/50">Drag and drop or click to upload</p>
                    <p className="text-[10px] text-white/30">Images will be automatically compressed</p>
                  </div>
                )}
              </div>
            )}

            {uploadError && (
              <p className="mt-2 text-xs text-red-400/90 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {uploadError}
              </p>
            )}

            {imagePreview && (
              <div className="mt-3 relative group">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Cover preview"
                  className="w-full max-h-40 object-cover rounded-lg border border-white/[0.08]"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white/70" />
                </button>
              </div>
            )}
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
              Short Description
              <span className="text-white/30 ml-2 normal-case tracking-normal">(for episode cards, 1-2 sentences)</span>
            </label>
            <textarea
              value={formData.shortDescription || ""}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all resize-none"
              placeholder="A brief teaser for the episode card (1-2 sentences max)"
            />
            <p className="mt-1.5 text-[10px] text-white/30">
              {(formData.shortDescription || "").length}/150 characters recommended
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-2">
              Full Description
              <span className="text-white/30 ml-2 normal-case tracking-normal">(shown on episode page)</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all resize-none"
              placeholder="Full episode description..."
              required
            />
          </div>

          {/* Streaming Links */}
          <div>
            <label className="block text-xs font-medium text-white/50 uppercase tracking-wider mb-3">
              Streaming Links
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-white/40 mb-1.5 flex items-center gap-1">
                  <Youtube className="w-3 h-3" />
                  YouTube URL or Video ID
                </label>
                <input
                  type="text"
                  value={youtubeInput}
                  onChange={(e) => handleYoutubeChange(e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                  placeholder="https://youtube.com/watch?v=... or dQw4w9WgXcQ"
                />
                {youtubeInput && youtubeInput !== formData.youtubeId && (
                  <p className="text-[10px] text-white/40 mt-1">ID: {formData.youtubeId}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] text-white/40 mb-1.5">Spotify URL</label>
                <input
                  type="text"
                  value={formData.spotifyUrl || ""}
                  onChange={(e) => updateField("spotifyUrl", e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                  placeholder="https://open.spotify.com/..."
                />
              </div>
              <div>
                <label className="block text-[10px] text-white/40 mb-1.5">Apple Podcasts URL</label>
                <input
                  type="text"
                  value={formData.applePodcastsUrl || ""}
                  onChange={(e) => updateField("applePodcastsUrl", e.target.value)}
                  className="w-full px-3 py-2 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all"
                  placeholder="https://podcasts.apple.com/..."
                />
              </div>
            </div>
          </div>

          {/* Transcript */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-medium text-white/50 uppercase tracking-wider">Transcript</label>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setTranscriptMode("timestamped")}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    transcriptMode === "timestamped"
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  Timestamped
                </button>
                <button
                  type="button"
                  onClick={() => setTranscriptMode("plain")}
                  className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                    transcriptMode === "plain"
                      ? "bg-white/10 text-white border border-white/15"
                      : "text-white/50 hover:text-white/70"
                  }`}
                >
                  Full Text
                </button>
              </div>
            </div>

            {transcriptMode === "plain" ? (
              <textarea
                value={plainTranscript}
                onChange={(e) => setPlainTranscript(e.target.value)}
                rows={6}
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-lg text-white text-sm font-mono placeholder:text-white/25 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] transition-all resize-none"
                placeholder="Paste the full transcript here..."
              />
            ) : (
              <div className="space-y-2">
                {(Array.isArray(formData.transcript) ? formData.transcript : []).map((entry, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="text"
                      value={typeof entry === "object" ? entry.time : ""}
                      onChange={(e) => updateTranscriptEntry(index, "time", e.target.value)}
                      className="w-20 px-2 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-white text-xs font-mono placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-all"
                      placeholder="00:00"
                    />
                    <input
                      type="text"
                      value={typeof entry === "object" ? entry.text : ""}
                      onChange={(e) => updateTranscriptEntry(index, "text", e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-all"
                      placeholder="Transcript text"
                    />
                    <button
                      type="button"
                      onClick={() => removeTranscriptEntry(index)}
                      className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTranscriptEntry}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add entry
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Sections */}
          {/* Carve Outs */}
          <div className="border border-white/[0.06] rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("carveOuts")}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Carve Outs (Optional)</span>
              {expandedSections.includes("carveOuts") ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </button>
            {expandedSections.includes("carveOuts") && (
              <div className="p-4 space-y-3 border-t border-white/[0.06]">
                {(formData.carveOuts || []).map((carveOut, index) => (
                  <div key={index} className="p-3 bg-white/[0.02] rounded-lg space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={carveOut.person}
                        onChange={(e) => updateCarveOut(index, "person", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-all"
                        placeholder="Person name"
                      />
                      <button
                        type="button"
                        onClick={() => removeCarveOut(index)}
                        className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={carveOut.items.join(", ")}
                      onChange={(e) => updateCarveOut(index, "items", e.target.value.split(", "))}
                      className="w-full px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-all"
                      placeholder="Items (comma separated)"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCarveOut}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add carve out
                </button>
              </div>
            )}
          </div>

          {/* Follow Ups */}
          <div className="border border-white/[0.06] rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("followUps")}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">
                Follow Ups & Corrections (Optional)
              </span>
              {expandedSections.includes("followUps") ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </button>
            {expandedSections.includes("followUps") && (
              <div className="p-4 space-y-2 border-t border-white/[0.06]">
                {(formData.followUps || []).map((followUp, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={followUp}
                      onChange={(e) => updateFollowUp(index, e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-all"
                      placeholder="Follow up or correction"
                    />
                    <button
                      type="button"
                      onClick={() => removeFollowUp(index)}
                      className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addFollowUp}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add follow up
                </button>
              </div>
            )}
          </div>

          {/* Sponsors */}
          <div className="border border-white/[0.06] rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => toggleSection("sponsors")}
              className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <span className="text-xs font-medium text-white/60 uppercase tracking-wider">Sponsors (Optional)</span>
              {expandedSections.includes("sponsors") ? (
                <ChevronUp className="w-4 h-4 text-white/40" />
              ) : (
                <ChevronDown className="w-4 h-4 text-white/40" />
              )}
            </button>
            {expandedSections.includes("sponsors") && (
              <div className="p-4 space-y-3 border-t border-white/[0.06]">
                {(formData.sponsors || []).map((sponsor, index) => (
                  <div key={index} className="p-3 bg-white/[0.02] rounded-lg space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={sponsor.name}
                        onChange={(e) => updateSponsor(index, "name", e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-all"
                        placeholder="Sponsor name"
                      />
                      <button
                        type="button"
                        onClick={() => removeSponsor(index)}
                        className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={sponsor.description}
                      onChange={(e) => updateSponsor(index, "description", e.target.value)}
                      className="w-full px-3 py-1.5 bg-white/[0.04] border border-white/[0.08] rounded-md text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-all"
                      placeholder="Sponsor description"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSponsor}
                  className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/70 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add sponsor
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="relative flex items-center justify-between px-6 py-4 border-t border-white/[0.08] bg-black">
          {saveMessage && (
            <div
              className={`flex items-center gap-1.5 text-xs ${saveMessage.type === "success" ? "text-emerald-400" : "text-red-400"}`}
            >
              {saveMessage.type === "success" ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              {saveMessage.text}
            </div>
          )}
          <div className="flex items-center gap-3 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-white/60 hover:text-white/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-medium rounded-lg hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {isCreating ? "Create Episode" : "Save Episode"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

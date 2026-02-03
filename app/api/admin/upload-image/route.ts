import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Verify admin session from Authorization header
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Basic token validation
  try {
    const decoded = atob(token)
    const [, expiryStr] = decoded.split(":")
    const expiry = Number.parseInt(expiryStr, 10)
    if (Date.now() > expiry) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  // Generate unique filename
  const timestamp = Date.now()
  const randomId = Math.random().toString(36).substring(2, 8)
  const filename = `episode-covers/${timestamp}-${randomId}`

  // Return the pathname for client-side upload
  return NextResponse.json({
    uploadUrl: `/api/admin/upload-image/blob`,
    pathname: filename,
  })
}

export async function POST(request: NextRequest) {
  // Verify admin session from Authorization header
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Basic token validation
  try {
    const decoded = atob(token)
    const [, expiryStr] = decoded.split(":")
    const expiry = Number.parseInt(expiryStr, 10)
    if (Date.now() > expiry) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }
  } catch {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 })
  }

  try {
    // Get the raw body as array buffer
    const arrayBuffer = await request.arrayBuffer()
    const contentType = request.headers.get("content-type") || "image/jpeg"

    // Generate unique filename
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 8)
    const extension = contentType.split("/")[1] || "jpg"
    const filename = `episode-covers/${timestamp}-${randomId}.${extension}`

    // Upload to Vercel Blob
    const blob = await put(filename, arrayBuffer, {
      access: "public",
      contentType: contentType,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}

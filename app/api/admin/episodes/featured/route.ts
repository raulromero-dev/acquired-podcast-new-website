import { type NextRequest, NextResponse } from "next/server"
import { verifyAdminSession } from "@/lib/admin-auth"

// Reference the same in-memory store (in production, use shared state/database)
const featuredSlugs: string[] = ["10-years-of-acquired-with-michael-lewis", "coca-cola", "trader-joes"]

export { featuredSlugs }

// POST - Toggle featured status
export async function POST(request: NextRequest) {
  const session = await verifyAdminSession(request)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug } = await request.json()

    const index = featuredSlugs.indexOf(slug)
    if (index === -1) {
      // Add to featured (max 6)
      if (featuredSlugs.length >= 6) {
        featuredSlugs.pop()
      }
      featuredSlugs.unshift(slug)
    } else {
      // Remove from featured
      featuredSlugs.splice(index, 1)
    }

    return NextResponse.json({ success: true, featuredSlugs })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}

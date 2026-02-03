import { cookies } from "next/headers"
import type { NextRequest } from "next/server"

const ADMIN_USERNAME = "admin-1"
export const SESSION_COOKIE = "admin_session"
export const SESSION_DURATION = 60 * 60 * 24 // 24 hours in seconds

// The session token encodes the expiry time for stateless validation
function createSessionToken(): string {
  const expiry = Date.now() + SESSION_DURATION * 1000
  const payload = `${ADMIN_USERNAME}:${expiry}`
  // Simple base64 encoding (in production, use JWT with proper signing)
  return Buffer.from(payload).toString("base64")
}

function validateSessionToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [username, expiryStr] = decoded.split(":")
    const expiry = Number.parseInt(expiryStr, 10)
    return username === ADMIN_USERNAME && Date.now() < expiry
  } catch {
    return false
  }
}

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  const expectedPassword = process.env.PASSWORD_1

  console.log("[v0] Validating credentials for username:", username)
  console.log("[v0] PASSWORD_1 env var exists:", !!expectedPassword)

  if (!expectedPassword) {
    console.error("[v0] PASSWORD_1 environment variable is not set")
    return false
  }

  const isValid = username === ADMIN_USERNAME && password === expectedPassword
  console.log("[v0] Credentials valid:", isValid)
  return isValid
}

export async function createSession(): Promise<string> {
  return createSessionToken()
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION,
    path: "/",
  })
}

export async function getSessionCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(SESSION_COOKIE)?.value
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSessionCookie()
  if (!session) {
    return false
  }
  return validateSessionToken(session)
}

export async function verifyAdminSession(request: NextRequest): Promise<boolean> {
  // First check Authorization header (localStorage-based auth)
  const authHeader = request.headers.get("Authorization")
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7)
    if (validateSessionToken(token)) {
      return true
    }
  }

  // Fall back to cookie-based auth
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value
  if (!sessionToken) {
    return false
  }
  return validateSessionToken(sessionToken)
}

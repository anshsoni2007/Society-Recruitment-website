import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "./prisma";
import { Role, SessionUser } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "crewdeck-fallback-secret-2026";
const COOKIE_NAME = "crewdeck_session";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signJwtToken(payload: { userId: string; role: string; email: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwtToken(token: string): { userId: string; role: string; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string; email: string };
  } catch {
    return null;
  }
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export function removeSessionCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getSessionUser(req?: NextRequest): Promise<SessionUser | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
  } else {
    try {
      const cookieStore = cookies();
      token = cookieStore.get(COOKIE_NAME)?.value;
    } catch {
      // Handle context where cookies() is not available
      return null;
    }
  }

  if (!token) return null;

  const decoded = verifyJwtToken(token);
  if (!decoded || !decoded.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    include: {
      societyMemberships: {
        include: {
          society: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role as Role,
    rollNumber: user.rollNumber,
    department: user.department,
    yearOfStudy: user.yearOfStudy,
    avatarUrl: user.avatarUrl,
    societyMemberships: user.societyMemberships,
  };
}

export async function requireAuth(req: NextRequest): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const user = await getSessionUser(req);
  if (!user) {
    return {
      error: NextResponse.json(
        { error: "Authentication required. Please log in to continue." },
        { status: 401 }
      ),
    };
  }
  return { user };
}

export async function requireRole(
  req: NextRequest,
  allowedRoles: Role[]
): Promise<{ user: SessionUser } | { error: NextResponse }> {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth;

  if (!allowedRoles.includes(auth.user.role)) {
    return {
      error: NextResponse.json(
        { error: "Access forbidden. Insufficient permissions for this action." },
        { status: 403 }
      ),
    };
  }

  return auth;
}

export async function verifySocietyAdmin(
  req: NextRequest,
  societyId: string
): Promise<{ user: SessionUser; isAdmin: boolean } | { error: NextResponse }> {
  const auth = await requireAuth(req);
  if ("error" in auth) return auth;

  if (auth.user.role === "SUPER_ADMIN") {
    return { user: auth.user, isAdmin: true };
  }

  const isMember = auth.user.societyMemberships?.some(
    (m) => m.societyId === societyId
  );

  if (!isMember && auth.user.role !== "SOCIETY_LEAD") {
    return {
      error: NextResponse.json(
        { error: "Access forbidden. You are not a manager of this society." },
        { status: 403 }
      ),
    };
  }

  return { user: auth.user, isAdmin: true };
}

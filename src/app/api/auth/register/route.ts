import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signJwtToken, setSessionCookie } from "@/lib/auth";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid university email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "SOCIETY_LEAD", "REVIEWER"]).default("STUDENT"),
  rollNumber: z.string().optional(),
  department: z.string().optional(),
  yearOfStudy: z.number().int().min(1).max(5).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { email, password, fullName, role, rollNumber, department, yearOfStudy } = parsed.data;

    // Check if email is already registered
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in database
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role,
        rollNumber: rollNumber || null,
        department: department || null,
        yearOfStudy: yearOfStudy || null,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`,
      },
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Welcome to CrewDeck! 🚀",
        message: "Your profile is active. Browse active societies and begin your recruitment applications.",
        type: "SYSTEM",
        link: "/societies",
      },
    });

    const token = signJwtToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
      { status: 201 }
    );

    setSessionCookie(response, token);
    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Internal server error while registering user." },
      { status: 500 }
    );
  }
}

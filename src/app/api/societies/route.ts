import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const isHiringParam = searchParams.get("isHiring");
    const search = searchParams.get("search");

    const whereClause: any = {};

    if (category && category !== "ALL") {
      whereClause.category = category;
    }

    if (isHiringParam !== null && isHiringParam !== undefined && isHiringParam !== "") {
      whereClause.isHiring = isHiringParam === "true";
    }

    if (search && search.trim() !== "") {
      whereClause.OR = [
        { name: { contains: search } },
        { tagline: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const societies = await prisma.society.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            applications: true,
            members: true,
          },
        },
        rounds: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ societies });
  } catch (error) {
    console.error("Fetch Societies Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch societies" },
      { status: 500 }
    );
  }
}

const createSocietySchema = z.object({
  name: z.string().min(3, "Society name must be at least 3 characters"),
  tagline: z.string().min(5, "Tagline must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum([
    "TECHNICAL",
    "CULTURAL",
    "SPORTS",
    "LITERARY",
    "SOCIAL_INITIATIVE",
    "ACADEMIC",
  ]),
  deadline: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid deadline date"),
  capacity: z.number().int().positive().default(50),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
  bannerUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRole(req, ["SUPER_ADMIN", "SOCIETY_LEAD"]);
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const parsed = createSocietySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = parsed.data;
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const existing = await prisma.society.findFirst({
      where: { OR: [{ name: data.name }, { slug }] },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A society with this name or slug already exists." },
        { status: 409 }
      );
    }

    const society = await prisma.society.create({
      data: {
        name: data.name,
        slug,
        tagline: data.tagline,
        description: data.description,
        category: data.category,
        deadline: new Date(data.deadline),
        capacity: data.capacity,
        websiteUrl: data.websiteUrl || null,
        logoUrl: data.logoUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",
        bannerUrl: data.bannerUrl || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
        isHiring: true,
        rounds: {
          create: [
            { name: "Round 1: Screening", order: 1, description: "Initial application review" },
            { name: "Round 2: Interview / Audition", order: 2, description: "Panel evaluation" },
          ],
        },
        members: {
          create: {
            userId: auth.user.id,
            roleInClub: "Lead Organizer",
          },
        },
      },
    });

    return NextResponse.json({ society }, { status: 201 });
  } catch (error) {
    console.error("Create Society Error:", error);
    return NextResponse.json(
      { error: "Internal server error while creating society." },
      { status: 500 }
    );
  }
}

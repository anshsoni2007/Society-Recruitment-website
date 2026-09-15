import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySocietyAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const society = await prisma.society.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        rounds: {
          orderBy: { order: "asc" },
        },
        customFields: {
          orderBy: { order: "asc" },
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                avatarUrl: true,
                role: true,
              },
            },
          },
        },
        interviewSlots: {
          where: {
            startTime: { gte: new Date() },
          },
          include: {
            bookings: {
              select: { id: true, studentId: true, status: true },
            },
          },
          orderBy: { startTime: "asc" },
        },
        _count: {
          select: {
            applications: true,
          },
        },
      },
    });

    if (!society) {
      return NextResponse.json(
        { error: "Society not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ society });
  } catch (error) {
    console.error("Get Society Error:", error);
    return NextResponse.json(
      { error: "Internal server error fetching society." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const auth = await verifySocietyAdmin(req, id);
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const {
      name,
      tagline,
      description,
      category,
      deadline,
      isHiring,
      capacity,
      logoUrl,
      bannerUrl,
      websiteUrl,
      socialLinks,
      customFields,
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (tagline !== undefined) updateData.tagline = tagline;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (deadline !== undefined) updateData.deadline = new Date(deadline);
    if (isHiring !== undefined) updateData.isHiring = isHiring;
    if (capacity !== undefined) updateData.capacity = parseInt(capacity);
    if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;
    if (socialLinks !== undefined) updateData.socialLinks = typeof socialLinks === "string" ? socialLinks : JSON.stringify(socialLinks);

    // Update custom fields if provided
    if (Array.isArray(customFields)) {
      // Delete existing and re-create to keep sync clean
      await prisma.formField.deleteMany({ where: { societyId: id } });
      if (customFields.length > 0) {
        await prisma.formField.createMany({
          data: customFields.map((f: any, idx: number) => ({
            societyId: id,
            label: f.label,
            fieldType: f.fieldType || "TEXT",
            placeholder: f.placeholder || null,
            required: f.required !== false,
            options: f.options ? (typeof f.options === "string" ? f.options : JSON.stringify(f.options)) : null,
            order: idx + 1,
          })),
        });
      }
    }

    const updated = await prisma.society.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ society: updated });
  } catch (error) {
    console.error("Update Society Error:", error);
    return NextResponse.json(
      { error: "Failed to update society." },
      { status: 500 }
    );
  }
}

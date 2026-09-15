import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const applications = await prisma.application.findMany({
      where: { studentId: auth.user.id },
      include: {
        society: {
          select: {
            id: true,
            name: true,
            slug: true,
            category: true,
            logoUrl: true,
            bannerUrl: true,
            deadline: true,
            isHiring: true,
            interviewSlots: {
              where: { startTime: { gte: new Date() } },
              include: {
                bookings: true,
              },
            },
          },
        },
        currentRound: true,
        interview: {
          include: {
            slot: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch My Applications Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch your applications." },
      { status: 500 }
    );
  }
}

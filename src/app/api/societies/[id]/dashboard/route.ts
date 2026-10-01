import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySocietyAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const auth = await verifySocietyAdmin(req, id);
    if ("error" in auth) return auth.error;

    const targetSocietyId = auth.societyId;

    // Run parallel server database queries for maximum performance
    const [society, applications, interviewSlots] = await Promise.all([
      prisma.society.findUnique({
        where: { id: targetSocietyId },
        include: {
          rounds: { orderBy: { order: "asc" } },
          customFields: { orderBy: { order: "asc" } },
          _count: {
            select: {
              applications: true,
              members: true,
            },
          },
        },
      }),

      prisma.application.findMany({
        where: { societyId: targetSocietyId },
        include: {
          student: {
            select: {
              id: true,
              fullName: true,
              email: true,
              rollNumber: true,
              department: true,
              yearOfStudy: true,
              avatarUrl: true,
            },
          },
          currentRound: {
            select: { id: true, name: true, order: true },
          },
          evaluations: {
            include: {
              reviewer: {
                select: { id: true, fullName: true, avatarUrl: true },
              },
            },
          },
          interview: {
            include: {
              slot: true,
            },
          },
        },
        orderBy: { submittedAt: "desc" },
      }),

      prisma.interviewSlot.findMany({
        where: { societyId: targetSocietyId },
        include: {
          bookings: {
            include: {
              student: {
                select: { id: true, fullName: true, email: true, rollNumber: true },
              },
              application: {
                select: { id: true, status: true },
              },
            },
          },
        },
        orderBy: { startTime: "asc" },
      }),
    ]);

    if (!society) {
      return NextResponse.json({ error: "Society not found" }, { status: 404 });
    }

    return NextResponse.json({
      society,
      applications,
      interviewSlots,
    });
  } catch (error) {
    console.error("Fetch Society Dashboard Data Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch society dashboard data." },
      { status: 500 }
    );
  }
}

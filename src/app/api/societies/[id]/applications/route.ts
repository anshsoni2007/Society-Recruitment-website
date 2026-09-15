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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const roundId = searchParams.get("roundId");
    const search = searchParams.get("search");

    const whereClause: any = { societyId: id };

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    if (roundId && roundId !== "ALL") {
      whereClause.roundId = roundId;
    }

    if (search && search.trim() !== "") {
      whereClause.student = {
        OR: [
          { fullName: { contains: search } },
          { email: { contains: search } },
          { rollNumber: { contains: search } },
          { department: { contains: search } },
        ],
      };
    }

    const applications = await prisma.application.findMany({
      where: whereClause,
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
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Fetch Society Applications Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch applicants." },
      { status: 500 }
    );
  }
}

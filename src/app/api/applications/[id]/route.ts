import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const { id } = params;

    const application = await prisma.application.findUnique({
      where: { id },
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
        society: {
          include: {
            customFields: { orderBy: { order: "asc" } },
            rounds: { orderBy: { order: "asc" } },
          },
        },
        currentRound: true,
        evaluations: {
          include: {
            reviewer: {
              select: { id: true, fullName: true, avatarUrl: true, role: true },
            },
          },
        },
        interview: {
          include: {
            slot: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Permission check: Student owner OR Society Admin OR Super Admin
    const isOwner = application.studentId === auth.user.id;
    const isSuperAdmin = auth.user.role === "SUPER_ADMIN";
    const isSocietyManager = auth.user.societyMemberships?.some(
      (m) => m.societyId === application.societyId
    );

    if (!isOwner && !isSuperAdmin && !isSocietyManager && auth.user.role !== "SOCIETY_LEAD") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Get Application Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const { id } = params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: { society: true },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Check if student owns application
    if (application.studentId !== auth.user.id && auth.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "You can only withdraw your own applications" },
        { status: 403 }
      );
    }

    // Check if deadline has passed for withdrawal
    const now = new Date();
    if (now.getTime() > new Date(application.society.deadline).getTime()) {
      return NextResponse.json(
        { error: "Cannot withdraw application after the recruitment deadline has passed." },
        { status: 400 }
      );
    }

    await prisma.application.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Application withdrawn successfully" });
  } catch (error) {
    console.error("Withdraw Application Error:", error);
    return NextResponse.json(
      { error: "Failed to withdraw application" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sendMockEmail } from "@/lib/mockEmails";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const { id } = params;
    const body = await req.json();
    const { status, roundId, internalNotes } = body;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        society: true,
        student: true,
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Permission check: Must be Super Admin or Society Lead of this club
    const isSuperAdmin = auth.user.role === "SUPER_ADMIN";
    const isSocietyManager = auth.user.societyMemberships?.some(
      (m) => m.societyId === application.societyId
    );

    if (!isSuperAdmin && !isSocietyManager && auth.user.role !== "SOCIETY_LEAD") {
      return NextResponse.json(
        { error: "Unauthorized to modify this application" },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (roundId !== undefined) updateData.roundId = roundId;
    if (internalNotes !== undefined) updateData.internalNotes = internalNotes;

    const updated = await prisma.application.update({
      where: { id },
      data: updateData,
      include: {
        student: true,
        currentRound: true,
        society: true,
      },
    });

    // Send notifications and mock emails based on status
    if (status === "INTERVIEW_SCHEDULED") {
      await prisma.notification.create({
        data: {
          userId: application.studentId,
          title: `Interview Call: ${application.society.name} 📅`,
          message: `Congratulations! You've advanced to the interview stage. Please reserve your slot.`,
          type: "INTERVIEW_INVITE",
          link: "/dashboard/applications",
        },
      });

      await sendMockEmail({
        recipient: application.student.email,
        subject: `📅 Interview Call: ${application.society.name}`,
        template: "INTERVIEW_INVITATION",
        data: {
          studentName: application.student.fullName,
          societyName: application.society.name,
        },
      });
    } else if (status === "ACCEPTED") {
      await prisma.notification.create({
        data: {
          userId: application.studentId,
          title: `Induction Offer: ${application.society.name} 🌟`,
          message: `Congratulations! You have been accepted into ${application.society.name}!`,
          type: "STATUS_CHANGE",
          link: "/dashboard/applications",
        },
      });

      await sendMockEmail({
        recipient: application.student.email,
        subject: `🌟 Official Offer: Welcome to ${application.society.name}!`,
        template: "OFFER_LETTER",
        data: {
          studentName: application.student.fullName,
          societyName: application.society.name,
        },
      });
    } else if (status === "REJECTED") {
      await prisma.notification.create({
        data: {
          userId: application.studentId,
          title: `Recruitment Update: ${application.society.name}`,
          message: `Thank you for your interest in ${application.society.name}. Unfortunately, we cannot offer you a spot this cycle.`,
          type: "STATUS_CHANGE",
          link: "/dashboard/applications",
        },
      });

      await sendMockEmail({
        recipient: application.student.email,
        subject: `Recruitment Update: ${application.society.name}`,
        template: "REJECTION",
        data: {
          studentName: application.student.fullName,
          societyName: application.society.name,
          status: "Rejected",
        },
      });
    } else if (status === "ROUND_ADVANCED") {
      await prisma.notification.create({
        data: {
          userId: application.studentId,
          title: `Round Advanced: ${application.society.name} 🚀`,
          message: `Great news! You have advanced to ${updated.currentRound?.name || "the next round"}.`,
          type: "STATUS_CHANGE",
          link: "/dashboard/applications",
        },
      });

      await sendMockEmail({
        recipient: application.student.email,
        subject: `🚀 Round Advanced: ${application.society.name}`,
        template: "STATUS_UPDATED",
        data: {
          studentName: application.student.fullName,
          societyName: application.society.name,
          status: `Advanced to ${updated.currentRound?.name || "Next Stage"}`,
        },
      });
    }

    return NextResponse.json({ application: updated });
  } catch (error) {
    console.error("Update Application Status Error:", error);
    return NextResponse.json(
      { error: "Failed to update application status" },
      { status: 500 }
    );
  }
}

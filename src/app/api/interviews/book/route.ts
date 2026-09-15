import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sendMockEmail } from "@/lib/mockEmails";
import { formatDateTime } from "@/lib/utils";

const bookSchema = z.object({
  slotId: z.string().uuid("Invalid slot ID"),
  applicationId: z.string().uuid("Invalid application ID"),
});

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const parsed = bookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid booking parameters" },
        { status: 422 }
      );
    }

    const { slotId, applicationId } = parsed.data;

    // Verify application ownership
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
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

    if (application.studentId !== auth.user.id) {
      return NextResponse.json(
        { error: "You can only book interview slots for your own application" },
        { status: 403 }
      );
    }

    // Verify slot availability
    const slot = await prisma.interviewSlot.findUnique({
      where: { id: slotId },
      include: {
        bookings: true,
      },
    });

    if (!slot) {
      return NextResponse.json(
        { error: "Interview slot not found" },
        { status: 404 }
      );
    }

    if (slot.bookings.length >= slot.maxCapacity) {
      return NextResponse.json(
        { error: "This interview slot has already reached maximum capacity. Please pick another slot." },
        { status: 409 }
      );
    }

    // Create or update interview booking
    const booking = await prisma.interviewBooking.upsert({
      where: { applicationId },
      update: {
        slotId,
        status: "CONFIRMED",
      },
      create: {
        slotId,
        applicationId,
        studentId: auth.user.id,
        status: "CONFIRMED",
      },
      include: {
        slot: true,
      },
    });

    // Update application status to INTERVIEW_SCHEDULED
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: "INTERVIEW_SCHEDULED" },
    });

    // Create confirmation notification
    const formattedSlot = `${formatDateTime(slot.startTime)} (${slot.location})`;
    await prisma.notification.create({
      data: {
        userId: auth.user.id,
        title: `Interview Slot Confirmed 📅`,
        message: `Your interview with ${application.society.name} is booked for ${formattedSlot}.`,
        type: "INTERVIEW_INVITE",
        link: "/dashboard/applications",
      },
    });

    // Dispatch mock email
    await sendMockEmail({
      recipient: application.student.email,
      subject: `✅ Interview Slot Confirmed: ${application.society.name}`,
      template: "INTERVIEW_INVITATION",
      data: {
        studentName: application.student.fullName,
        societyName: application.society.name,
        slotDetails: formattedSlot,
      },
    });

    return NextResponse.json({
      message: "Interview slot booked successfully!",
      booking,
    });
  } catch (error) {
    console.error("Book Slot Error:", error);
    return NextResponse.json(
      { error: "Failed to reserve interview slot" },
      { status: 500 }
    );
  }
}

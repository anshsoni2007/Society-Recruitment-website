import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifySocietyAdmin } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const slots = await prisma.interviewSlot.findMany({
      where: { societyId: id },
      include: {
        bookings: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true },
            },
            application: {
              select: { id: true, status: true },
            },
          },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Get Slots Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch interview slots" },
      { status: 500 }
    );
  }
}

const slotSchema = z.object({
  startTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid start time"),
  endTime: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid end time"),
  location: z.string().min(2, "Location or meeting link required"),
  maxCapacity: z.number().int().positive().default(1),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const auth = await verifySocietyAdmin(req, id);
    if ("error" in auth) return auth.error;

    const body = await req.json();
    const parsed = slotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { startTime, endTime, location, maxCapacity } = parsed.data;

    const slot = await prisma.interviewSlot.create({
      data: {
        societyId: id,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        location,
        maxCapacity,
      },
    });

    return NextResponse.json({ slot }, { status: 201 });
  } catch (error) {
    console.error("Create Slot Error:", error);
    return NextResponse.json(
      { error: "Failed to create interview slot." },
      { status: 500 }
    );
  }
}

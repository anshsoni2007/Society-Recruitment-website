import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const recipient = searchParams.get("recipient");

    const whereClause: any = {};
    if (recipient) {
      whereClause.recipient = recipient;
    }

    const emails = await prisma.mockEmailLog.findMany({
      where: whereClause,
      orderBy: { sentAt: "desc" },
      take: 30,
    });

    return NextResponse.json({ emails });
  } catch (error) {
    console.error("Get Mock Emails Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch email logs" },
      { status: 500 }
    );
  }
}

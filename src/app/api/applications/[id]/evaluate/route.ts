import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

const evaluationSchema = z.object({
  criteriaScores: z.record(z.number().min(1).max(10)),
  overallRating: z.number().int().min(1).max(10),
  feedback: z.string().min(5, "Please provide constructive feedback/notes"),
  recommendation: z.enum(["STRONG_YES", "YES", "MAYBE", "NO"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const { id: applicationId } = params;
    const body = await req.json();
    const parsed = evaluationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation error", details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { criteriaScores, overallRating, feedback, recommendation } = parsed.data;

    const evaluation = await prisma.reviewerScore.upsert({
      where: {
        applicationId_reviewerId: {
          applicationId,
          reviewerId: auth.user.id,
        },
      },
      update: {
        criteriaScores: JSON.stringify(criteriaScores),
        overallRating,
        feedback,
        recommendation,
      },
      create: {
        applicationId,
        reviewerId: auth.user.id,
        criteriaScores: JSON.stringify(criteriaScores),
        overallRating,
        feedback,
        recommendation,
      },
      include: {
        reviewer: {
          select: { id: true, fullName: true, avatarUrl: true },
        },
      },
    });

    return NextResponse.json({ evaluation }, { status: 201 });
  } catch (error) {
    console.error("Submit Evaluation Error:", error);
    return NextResponse.json(
      { error: "Failed to submit evaluation score." },
      { status: 500 }
    );
  }
}

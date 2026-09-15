import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { sendMockEmail } from "@/lib/mockEmails";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate user
    const auth = await requireAuth(req);
    if ("error" in auth) return auth.error;

    const studentId = auth.user.id;
    const { id: societyId } = params;

    // 2. Fetch society details & custom fields
    const society = await prisma.society.findFirst({
      where: {
        OR: [{ id: societyId }, { slug: societyId }],
      },
      include: {
        customFields: true,
        rounds: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!society) {
      return NextResponse.json(
        { error: "Society not found." },
        { status: 404 }
      );
    }

    // 3. SERVER-SIDE DEADLINE ENFORCEMENT
    const now = new Date();
    const deadline = new Date(society.deadline);

    if (now.getTime() > deadline.getTime()) {
      return NextResponse.json(
        {
          error: "Recruitment closed. The submission deadline for this society has passed.",
          deadline: society.deadline,
          currentTime: now,
        },
        { status: 403 }
      );
    }

    if (!society.isHiring) {
      return NextResponse.json(
        { error: "Recruitment is currently inactive for this society." },
        { status: 403 }
      );
    }

    // 4. DUPLICATE APPLICATION PREVENTION
    const existing = await prisma.application.findUnique({
      where: {
        studentId_societyId: {
          studentId,
          societyId: society.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          error: "You have already submitted an application to this society.",
          applicationId: existing.id,
          status: existing.status,
        },
        { status: 409 }
      );
    }

    // 5. PARSE & VALIDATE FORM RESPONSES
    const body = await req.json();
    const { responses = {}, resumeUrl, githubUrl, portfolioUrl } = body;

    // Validate required custom form fields
    for (const field of society.customFields) {
      if (field.required) {
        const val = responses[field.id];
        if (val === undefined || val === null || (typeof val === "string" && val.trim() === "")) {
          return NextResponse.json(
            {
              error: `Missing required response for: "${field.label}"`,
              fieldId: field.id,
            },
            { status: 422 }
          );
        }
      }
    }

    const firstRound = society.rounds[0];

    // 6. CREATE APPLICATION RECORD
    const application = await prisma.application.create({
      data: {
        studentId,
        societyId: society.id,
        roundId: firstRound ? firstRound.id : null,
        status: "SUBMITTED",
        responses: JSON.stringify(responses),
        resumeUrl: resumeUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
      },
      include: {
        society: {
          select: { name: true, slug: true, category: true },
        },
      },
    });

    // 7. CREATE IN-APP NOTIFICATION
    await prisma.notification.create({
      data: {
        userId: studentId,
        title: `Application Submitted: ${society.name} 📋`,
        message: `Your application has been received and queued for Round 1 screening.`,
        type: "STATUS_CHANGE",
        link: "/dashboard/applications",
      },
    });

    // 8. SEND MOCK TRANSACTIONAL CONFIRMATION EMAIL
    await sendMockEmail({
      recipient: auth.user.email,
      subject: `🎉 Application Received: ${society.name}`,
      template: "APPLICATION_SUBMITTED",
      data: {
        studentName: auth.user.fullName,
        societyName: society.name,
        status: "Submitted",
      },
    });

    return NextResponse.json(
      {
        message: "Application submitted successfully!",
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Apply Error:", error);
    return NextResponse.json(
      { error: "Internal server error while processing your application." },
      { status: 500 }
    );
  }
}

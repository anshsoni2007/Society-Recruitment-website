import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRole(req, ["SUPER_ADMIN", "SOCIETY_LEAD"]);
    if ("error" in auth) return auth.error;

    const { searchParams } = new URL(req.url);
    const societyId = searchParams.get("societyId");

    const appWhere: any = {};
    if (societyId && societyId !== "ALL") {
      appWhere.societyId = societyId;
    }

    const totalApplications = await prisma.application.count({ where: appWhere });
    const submittedCount = await prisma.application.count({ where: { ...appWhere, status: "SUBMITTED" } });
    const underReviewCount = await prisma.application.count({ where: { ...appWhere, status: "UNDER_REVIEW" } });
    const roundAdvancedCount = await prisma.application.count({ where: { ...appWhere, status: "ROUND_ADVANCED" } });
    const interviewCount = await prisma.application.count({ where: { ...appWhere, status: "INTERVIEW_SCHEDULED" } });
    const acceptedCount = await prisma.application.count({ where: { ...appWhere, status: "ACCEPTED" } });
    const rejectedCount = await prisma.application.count({ where: { ...appWhere, status: "REJECTED" } });

    // Funnel Data
    const funnel = [
      { stage: "Submitted", count: totalApplications, fill: "#38bdf8" },
      { stage: "Under Review / Advanced", count: underReviewCount + roundAdvancedCount + interviewCount + acceptedCount, fill: "#818cf8" },
      { stage: "Interview Scheduled", count: interviewCount + acceptedCount, fill: "#c084fc" },
      { stage: "Accepted / Inducted", count: acceptedCount, fill: "#34d399" },
    ];

    // Status breakdown
    const statusDistribution = [
      { name: "Submitted", value: submittedCount, color: "#38bdf8" },
      { name: "Reviewing", value: underReviewCount, color: "#fbbf24" },
      { name: "Advanced", value: roundAdvancedCount, color: "#818cf8" },
      { name: "Interview", value: interviewCount, color: "#c084fc" },
      { name: "Accepted", value: acceptedCount, color: "#34d399" },
      { name: "Rejected", value: rejectedCount, color: "#f87171" },
    ];

    // Category breakdown
    const societies = await prisma.society.findMany({
      include: {
        _count: { select: { applications: true } },
      },
    });

    const categoryMap: Record<string, number> = {};
    societies.forEach((s) => {
      categoryMap[s.category] = (categoryMap[s.category] || 0) + s._count.applications;
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      applications: count,
    }));

    const totalSocieties = await prisma.society.count();
    const activeRecruitments = await prisma.society.count({ where: { isHiring: true } });
    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });

    return NextResponse.json({
      metrics: {
        totalApplications,
        acceptedCount,
        acceptanceRate: totalApplications > 0 ? ((acceptedCount / totalApplications) * 100).toFixed(1) : 0,
        totalSocieties,
        activeRecruitments,
        totalStudents,
      },
      funnel,
      statusDistribution,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: "Failed to generate recruitment analytics" },
      { status: 500 }
    );
  }
}

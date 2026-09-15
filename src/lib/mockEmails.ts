import { prisma } from "./prisma";

export interface SendMockEmailParams {
  recipient: string;
  subject: string;
  template: "APPLICATION_SUBMITTED" | "STATUS_UPDATED" | "INTERVIEW_INVITATION" | "OFFER_LETTER" | "REJECTION";
  data: {
    studentName: string;
    societyName: string;
    status?: string;
    roundName?: string;
    slotDetails?: string;
    rejectionReason?: string;
  };
}

export async function sendMockEmail({ recipient, subject, template, data }: SendMockEmailParams) {
  let htmlBody = "";

  if (template === "APPLICATION_SUBMITTED") {
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 20px;">🎉 Application Confirmed — CrewDeck</h2>
        </div>
        <p style="font-size: 16px; color: #cbd5e1;">Dear <strong>${data.studentName}</strong>,</p>
        <p style="color: #94a3b8; line-height: 1.6;">
          Your recruitment application to <strong>${data.societyName}</strong> has been successfully submitted and logged into the candidate pipeline.
        </p>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
          <p style="margin: 0; color: #e2e8f0; font-size: 14px;"><strong>Society:</strong> ${data.societyName}</p>
          <p style="margin: 6px 0 0 0; color: #38bdf8; font-size: 14px;"><strong>Initial Status:</strong> Submitted & Queued for Screening</p>
        </div>
        <p style="color: #94a3b8; font-size: 14px;">You can track real-time stage updates directly from your CrewDeck student dashboard.</p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
          CrewDeck Campus Recruitment Engine • Sent automatically
        </div>
      </div>
    `;
  } else if (template === "INTERVIEW_INVITATION") {
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <div style="background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 20px;">📅 Interview Call: ${data.societyName}</h2>
        </div>
        <p style="font-size: 16px; color: #cbd5e1;">Congratulations <strong>${data.studentName}</strong>!</p>
        <p style="color: #94a3b8; line-height: 1.6;">
          You have been shortlisted for the interview round of <strong>${data.societyName}</strong>.
        </p>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #a855f7;">
          <p style="margin: 0; color: #e2e8f0; font-size: 14px;"><strong>Action Required:</strong> Please log into CrewDeck to book your preferred interview time slot before slots fill up.</p>
          ${data.slotDetails ? `<p style="margin: 6px 0 0 0; color: #c084fc; font-size: 14px;"><strong>Reserved Slot:</strong> ${data.slotDetails}</p>` : ""}
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
          CrewDeck Campus Recruitment Engine • Sent automatically
        </div>
      </div>
    `;
  } else if (template === "OFFER_LETTER") {
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 20px;">🌟 Official Offer: Welcome to ${data.societyName}!</h2>
        </div>
        <p style="font-size: 16px; color: #cbd5e1;">Dear <strong>${data.studentName}</strong>,</p>
        <p style="color: #94a3b8; line-height: 1.6;">
          On behalf of the executive board, we are thrilled to offer you induction into <strong>${data.societyName}</strong>! Your performance and enthusiasm throughout our evaluation rounds stood out.
        </p>
        <div style="background: #1e293b; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="margin: 0; color: #34d399; font-weight: bold;">Status: ACCEPTED / INDUCTED</p>
          <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 14px;">Check your CrewDeck dashboard for onboarding instructions and society orientation schedules.</p>
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
          CrewDeck Campus Recruitment Engine • Sent automatically
        </div>
      </div>
    `;
  } else {
    htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <div style="background: #334155; padding: 16px 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="margin: 0; color: #ffffff; font-size: 20px;">Recruitment Update: ${data.societyName}</h2>
        </div>
        <p style="font-size: 16px; color: #cbd5e1;">Hello <strong>${data.studentName}</strong>,</p>
        <p style="color: #94a3b8; line-height: 1.6;">
          Your application status for <strong>${data.societyName}</strong> has been updated to: <strong>${data.status || "Updated"}</strong>.
        </p>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
          CrewDeck Campus Recruitment Engine • Sent automatically
        </div>
      </div>
    `;
  }

  try {
    const log = await prisma.mockEmailLog.create({
      data: {
        recipient,
        subject,
        template,
        htmlBody,
        status: "DELIVERED",
      },
    });
    return log;
  } catch (err) {
    console.error("Failed to log mock email:", err);
    return null;
  }
}

export type Role = "STUDENT" | "SOCIETY_LEAD" | "REVIEWER" | "SUPER_ADMIN";

export type ApplicationStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ROUND_ADVANCED"
  | "INTERVIEW_SCHEDULED"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export type SocietyCategory =
  | "TECHNICAL"
  | "CULTURAL"
  | "SPORTS"
  | "LITERARY"
  | "SOCIAL_INITIATIVE"
  | "ACADEMIC";

export interface SessionUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  rollNumber?: string | null;
  department?: string | null;
  yearOfStudy?: number | null;
  avatarUrl?: string | null;
  societyMemberships?: Array<{
    societyId: string;
    roleInClub: string;
    society: {
      id: string;
      name: string;
      slug: string;
    };
  }>;
}

export interface FormFieldItem {
  id: string;
  societyId: string;
  label: string;
  fieldType: "TEXT" | "TEXTAREA" | "SELECT" | "URL" | "RADIO" | "CHECKBOX";
  placeholder?: string | null;
  required: boolean;
  options?: string[] | null;
  order: number;
}

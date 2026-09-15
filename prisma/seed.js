const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting CrewDeck database seeding...");

  // Clean existing records
  await prisma.mockEmailLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.interviewBooking.deleteMany();
  await prisma.interviewSlot.deleteMany();
  await prisma.reviewerScore.deleteMany();
  await prisma.application.deleteMany();
  await prisma.formField.deleteMany();
  await prisma.recruitmentRound.deleteMany();
  await prisma.societyMember.deleteMany();
  await prisma.society.deleteMany();
  await prisma.user.deleteMany();

  const hashedStudentPassword = await bcrypt.hash("Student@123", 10);
  const hashedLeadPassword = await bcrypt.hash("Lead@123", 10);
  const hashedAdminPassword = await bcrypt.hash("Admin@123", 10);
  const hashedReviewerPassword = await bcrypt.hash("Reviewer@123", 10);

  // 1. Create Users
  const superAdmin = await prisma.user.create({
    data: {
      email: "admin@campus.edu",
      passwordHash: hashedAdminPassword,
      fullName: "Dean of Student Affairs",
      role: "SUPER_ADMIN",
      department: "University Administration",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const gdgLead = await prisma.user.create({
    data: {
      email: "lead.gdg@campus.edu",
      passwordHash: hashedLeadPassword,
      fullName: "Arjun Mehta",
      role: "SOCIETY_LEAD",
      rollNumber: "2023CSB1042",
      department: "Computer Science & Engineering",
      yearOfStudy: 3,
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    },
  });

  const roboticsLead = await prisma.user.create({
    data: {
      email: "lead.robotics@campus.edu",
      passwordHash: hashedLeadPassword,
      fullName: "Samantha Vance",
      role: "SOCIETY_LEAD",
      rollNumber: "2023ECB1089",
      department: "Electronics & Communication",
      yearOfStudy: 3,
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    },
  });

  const debSocLead = await prisma.user.create({
    data: {
      email: "lead.debsoc@campus.edu",
      passwordHash: hashedLeadPassword,
      fullName: "Kabir Sengupta",
      role: "SOCIETY_LEAD",
      rollNumber: "2023HSB1015",
      department: "Humanities & Social Sciences",
      yearOfStudy: 3,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    },
  });

  const reviewerTech = await prisma.user.create({
    data: {
      email: "reviewer.tech@campus.edu",
      passwordHash: hashedReviewerPassword,
      fullName: "Devika Nair",
      role: "REVIEWER",
      rollNumber: "2022CSB1008",
      department: "Computer Science",
      yearOfStudy: 4,
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    },
  });

  const studentAlex = await prisma.user.create({
    data: {
      email: "student.alex@campus.edu",
      passwordHash: hashedStudentPassword,
      fullName: "Alex Rivera",
      role: "STUDENT",
      rollNumber: "2025CSB1120",
      department: "Computer Science & Engineering",
      yearOfStudy: 2,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    },
  });

  const studentPriya = await prisma.user.create({
    data: {
      email: "student.priya@campus.edu",
      passwordHash: hashedStudentPassword,
      fullName: "Priya Sharma",
      role: "STUDENT",
      rollNumber: "2025EEB1044",
      department: "Electrical Engineering",
      yearOfStudy: 2,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const studentMarcus = await prisma.user.create({
    data: {
      email: "student.marcus@campus.edu",
      passwordHash: hashedStudentPassword,
      fullName: "Marcus Chen",
      role: "STUDENT",
      rollNumber: "2025MEB1012",
      department: "Mechanical Engineering",
      yearOfStudy: 2,
      avatarUrl: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log("✅ Users created.");

  // 2. Create Societies
  const now = new Date();
  const futureDeadline5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const futureDeadline3Days = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
  const futureDeadline7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const pastDeadline = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000); // For testing deadline check

  const gdgSociety = await prisma.society.create({
    data: {
      name: "Google Developer Student Club (GDG)",
      slug: "gdg-campus",
      tagline: "Build solutions for real-world campus & community challenges with Google technologies.",
      description: "GDG on Campus is a community group for university students interested in Google developer technologies. Students from all undergraduate or graduate programs with an interest in growing as a developer are welcome. By joining GDSC, students grow their knowledge in a peer-to-peer learning environment and build solutions for local businesses and their community.",
      category: "TECHNICAL",
      logoUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=120&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80",
      websiteUrl: "https://gdg.community.dev",
      socialLinks: JSON.stringify({ instagram: "@gdg_campus", linkedin: "gdg-campus", github: "gdg-campus" }),
      isHiring: true,
      deadline: futureDeadline5Days,
      capacity: 35,
    },
  });

  const roboticsSociety = await prisma.society.create({
    data: {
      name: "Autonomous Robotics & AI Guild",
      slug: "robotics-guild",
      tagline: "Designing autonomous rovers, drones, and edge intelligence systems.",
      description: "We are the premier hardware and embedded AI club on campus. We participate in University Rover Challenge, RoboSub, and drone aerial autonomous navigation contests.",
      category: "TECHNICAL",
      logoUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=120&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
      websiteUrl: "https://robotics-guild.edu",
      socialLinks: JSON.stringify({ instagram: "@robotics_guild", github: "robotics-guild" }),
      isHiring: true,
      deadline: futureDeadline3Days,
      capacity: 25,
    },
  });

  const debSoc = await prisma.society.create({
    data: {
      name: "The Dialectic Society (DebSoc)",
      slug: "dialectic-society",
      tagline: "Fostering critical discourse, parliamentary debating, and persuasive rhetoric.",
      description: "DebSoc represents the institution at national and international Parliamentary Debates (Asian & British Parliamentary formats). We train thinkers to dissect nuanced geopolitical, philosophical, and socio-economic motions.",
      category: "LITERARY",
      logoUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=120&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80",
      websiteUrl: "https://debsoc.campus.edu",
      socialLinks: JSON.stringify({ instagram: "@dialectic_debsoc" }),
      isHiring: true,
      deadline: futureDeadline7Days,
      capacity: 20,
    },
  });

  const shutterSpeed = await prisma.society.create({
    data: {
      name: "ShutterSpeed Visual Arts & Film",
      slug: "shutterspeed-arts",
      tagline: "Capturing campus life through cinematography, street photography, and visual storytelling.",
      description: "From covering headline college festivals to producing indie short films and photo exhibitions, ShutterSpeed is the creative pulse of campus photography.",
      category: "CULTURAL",
      logoUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=120&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200&auto=format&fit=crop&q=80",
      isHiring: true,
      deadline: futureDeadline5Days,
      capacity: 30,
    },
  });

  const crescendoMusic = await prisma.society.create({
    data: {
      name: "Crescendo Music Guild",
      slug: "crescendo-music",
      tagline: "The official university acoustic and western band collective.",
      description: "A close-knit community of vocalists, instrumentalists, sound engineers, and producers putting up concerts, battle of the bands, and original studio releases.",
      category: "CULTURAL",
      logoUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80",
      isHiring: true,
      deadline: futureDeadline7Days,
      capacity: 18,
    },
  });

  const enactusClub = await prisma.society.create({
    data: {
      name: "Enactus Social Enterprise",
      slug: "enactus-social",
      tagline: "Empowering communities through sustainable student-led social entrepreneurship.",
      description: "We identify socio-economic inequalities and formulate sustainable, revenue-generating entrepreneurial business models to uplift underprivileged communities.",
      category: "SOCIAL_INITIATIVE",
      logoUrl: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=120&auto=format&fit=crop&q=80",
      bannerUrl: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?w=1200&auto=format&fit=crop&q=80",
      isHiring: false,
      deadline: pastDeadline, // Passed deadline to test expired banner
      capacity: 15,
    },
  });

  console.log("✅ Societies created.");

  // 3. Society Memberships (Leads)
  await prisma.societyMember.createMany({
    data: [
      { userId: gdgLead.id, societyId: gdgSociety.id, roleInClub: "Lead Organizer & Tech Lead" },
      { userId: roboticsLead.id, societyId: roboticsSociety.id, roleInClub: "President & AI Systems Lead" },
      { userId: debSocLead.id, societyId: debSoc.id, roleInClub: "President & Chief Adjudicator" },
      { userId: reviewerTech.id, societyId: gdgSociety.id, roleInClub: "Senior Reviewer & Panelist" },
    ],
  });

  // 4. Recruitment Rounds per Society
  const gdgRound1 = await prisma.recruitmentRound.create({
    data: { societyId: gdgSociety.id, name: "Round 1: Screening & Portfolio", order: 1, description: "Reviewing resume, past projects, and domain interests." },
  });
  const gdgRound2 = await prisma.recruitmentRound.create({
    data: { societyId: gdgSociety.id, name: "Round 2: Technical Task", order: 2, description: "Take-home code challenge or UI redesign sprint." },
  });
  const gdgRound3 = await prisma.recruitmentRound.create({
    data: { societyId: gdgSociety.id, name: "Round 3: Panel Interview", order: 3, description: "In-person technical and culture fit panel discussion." },
  });

  await prisma.recruitmentRound.createMany({
    data: [
      { societyId: roboticsSociety.id, name: "Round 1: Aptitude & CAD Screening", order: 1 },
      { societyId: roboticsSociety.id, name: "Round 2: Hardware Lab Challenge", order: 2 },
      { societyId: roboticsSociety.id, name: "Round 3: Board Interview", order: 3 },
      { societyId: debSoc.id, name: "Round 1: Extempore & Speech Audition", order: 1 },
      { societyId: debSoc.id, name: "Round 2: Live Parliamentary Debate", order: 2 },
      { societyId: shutterSpeed.id, name: "Round 1: Portfolio Review", order: 1 },
      { societyId: shutterSpeed.id, name: "Round 2: Live Campus Photo Walk", order: 2 },
      { societyId: crescendoMusic.id, name: "Round 1: Audio Sample Screening", order: 1 },
      { societyId: crescendoMusic.id, name: "Round 2: Live Jam Audition", order: 2 },
    ],
  });

  // 5. Custom Form Fields for GDG
  const gdgFieldTrack = await prisma.formField.create({
    data: {
      societyId: gdgSociety.id,
      label: "Primary Domain of Interest",
      fieldType: "SELECT",
      placeholder: "Select your track",
      required: true,
      options: JSON.stringify(["Web Development (Full Stack)", "Mobile App Dev (Flutter/React Native)", "AI / Machine Learning", "Cloud & DevOps", "UI/UX & Product Design"]),
      order: 1,
    },
  });

  const gdgFieldExp = await prisma.formField.create({
    data: {
      societyId: gdgSociety.id,
      label: "Highlight your proudest project or technical achievement",
      fieldType: "TEXTAREA",
      placeholder: "Describe the stack, your role, and what problem it solved...",
      required: true,
      order: 2,
    },
  });

  const gdgFieldCommit = await prisma.formField.create({
    data: {
      societyId: gdgSociety.id,
      label: "Weekly time commitment you can dedicate (Hours)",
      fieldType: "SELECT",
      required: true,
      options: JSON.stringify(["4 - 6 Hours / week", "8 - 10 Hours / week", "12+ Hours / week"]),
      order: 3,
    },
  });

  // Form Fields for DebSoc
  await prisma.formField.create({
    data: {
      societyId: debSoc.id,
      label: "Have you participated in parliamentary debates or MUNs previously?",
      fieldType: "SELECT",
      options: JSON.stringify(["Yes, extensively (3+ Tournaments)", "Yes, beginner level (1-2 Tournaments)", "No prior experience, eager to learn"]),
      required: true,
      order: 1,
    },
  });
  await prisma.formField.create({
    data: {
      societyId: debSoc.id,
      label: "Briefly defend or oppose: 'Artificial Intelligence will do more harm than good to academic integrity'",
      fieldType: "TEXTAREA",
      placeholder: "Give 2 strong arguments in 100-150 words...",
      required: true,
      order: 2,
    },
  });

  // 6. Interview Slots for GDG
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  tomorrow.setHours(16, 0, 0, 0); // 4:00 PM
  const slot1End = new Date(tomorrow.getTime() + 30 * 60 * 1000);

  const slot2Start = new Date(tomorrow.getTime() + 45 * 60 * 1000);
  const slot2End = new Date(slot2Start.getTime() + 30 * 60 * 1000);

  const slot1 = await prisma.interviewSlot.create({
    data: {
      societyId: gdgSociety.id,
      startTime: tomorrow,
      endTime: slot1End,
      location: "Room 402, Student Activity Center (SAC) & Google Meet",
      maxCapacity: 1,
    },
  });

  const slot2 = await prisma.interviewSlot.create({
    data: {
      societyId: gdgSociety.id,
      startTime: slot2Start,
      endTime: slot2End,
      location: "Room 402, Student Activity Center (SAC) & Google Meet",
      maxCapacity: 1,
    },
  });

  // 7. Seed Applications
  // Application 1: Alex Rivera -> GDG (Under Review / Interview Scheduled)
  const appAlex = await prisma.application.create({
    data: {
      studentId: studentAlex.id,
      societyId: gdgSociety.id,
      roundId: gdgRound3.id,
      status: "INTERVIEW_SCHEDULED",
      responses: JSON.stringify({
        [gdgFieldTrack.id]: "Web Development (Full Stack)",
        [gdgFieldExp.id]: "Built a peer-to-peer campus notes exchange platform using Next.js, TypeScript, and Supabase with 400+ active student users.",
        [gdgFieldCommit.id]: "8 - 10 Hours / week",
      }),
      githubUrl: "https://github.com/alexrivera-dev",
      portfolioUrl: "https://alexrivera.me",
      resumeUrl: "https://drive.google.com/alex-resume-2026.pdf",
      internalNotes: "Strong candidate, great fullstack foundation and enthusiastic communicator.",
    },
  });

  // Booking for Alex
  await prisma.interviewBooking.create({
    data: {
      slotId: slot1.id,
      applicationId: appAlex.id,
      studentId: studentAlex.id,
      status: "CONFIRMED",
    },
  });

  // Reviewer Score for Alex
  await prisma.reviewerScore.create({
    data: {
      applicationId: appAlex.id,
      reviewerId: reviewerTech.id,
      criteriaScores: JSON.stringify({ technical: 9, communication: 8, cultureFit: 9 }),
      overallRating: 9,
      feedback: "Exceptional command of React & REST APIs. Has already shipped live projects for campus students.",
      recommendation: "STRONG_YES",
    },
  });

  // Application 2: Priya Sharma -> GDG (Round 2 Advanced)
  await prisma.application.create({
    data: {
      studentId: studentPriya.id,
      societyId: gdgSociety.id,
      roundId: gdgRound2.id,
      status: "ROUND_ADVANCED",
      responses: JSON.stringify({
        [gdgFieldTrack.id]: "AI / Machine Learning",
        [gdgFieldExp.id]: "Developed a lightweight computer vision pipeline for automated attendance logging using OpenCV and PyTorch.",
        [gdgFieldCommit.id]: "8 - 10 Hours / week",
      }),
      githubUrl: "https://github.com/priyasharma-ml",
      internalNotes: "Impressive ML background, assigned take-home task on model deployment.",
    },
  });

  // Application 3: Marcus Chen -> GDG (Submitted / Screening)
  await prisma.application.create({
    data: {
      studentId: studentMarcus.id,
      societyId: gdgSociety.id,
      roundId: gdgRound1.id,
      status: "SUBMITTED",
      responses: JSON.stringify({
        [gdgFieldTrack.id]: "Mobile App Dev (Flutter/React Native)",
        [gdgFieldExp.id]: "Created a cross-platform campus mess menu and notification app in Flutter.",
        [gdgFieldCommit.id]: "4 - 6 Hours / week",
      }),
      githubUrl: "https://github.com/marcuschen-dev",
    },
  });

  // Application 4: Priya Sharma -> Robotics Guild (Accepted)
  await prisma.application.create({
    data: {
      studentId: studentPriya.id,
      societyId: roboticsSociety.id,
      status: "ACCEPTED",
      responses: JSON.stringify({
        general: "Passionate about ROS2 and motor telemetry systems.",
      }),
      githubUrl: "https://github.com/priyasharma-ml",
      internalNotes: "Top scorer in hardware test. Excellent addition to the rover navigation team.",
    },
  });

  // 8. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: studentAlex.id,
        title: "Interview Slot Confirmed 🎉",
        message: "Your interview with Google Developer Student Club is scheduled for tomorrow at 4:00 PM.",
        type: "INTERVIEW_INVITE",
        isRead: false,
        link: "/dashboard/applications",
      },
      {
        userId: studentPriya.id,
        title: "Congratulations! Induction Offer 🌟",
        message: "You have been officially accepted into Autonomous Robotics & AI Guild!",
        type: "STATUS_CHANGE",
        isRead: true,
        link: "/dashboard/applications",
      },
      {
        userId: studentMarcus.id,
        title: "Application Received",
        message: "Your application to Google Developer Student Club was successfully submitted.",
        type: "STATUS_CHANGE",
        isRead: true,
        link: "/dashboard/applications",
      },
    ],
  });

  // 9. Mock Email Logs
  await prisma.mockEmailLog.createMany({
    data: [
      {
        recipient: "student.alex@campus.edu",
        subject: "📅 Interview Invitation: Google Developer Student Club",
        template: "INTERVIEW_INVITATION",
        htmlBody: "Your interview for GDG has been scheduled for tomorrow at 4:00 PM in SAC 402.",
        status: "DELIVERED",
      },
      {
        recipient: "student.priya@campus.edu",
        subject: "🌟 Official Offer: Welcome to Autonomous Robotics & AI Guild!",
        template: "OFFER_LETTER",
        htmlBody: "On behalf of the executive board, we are thrilled to offer you induction into Autonomous Robotics & AI Guild!",
        status: "DELIVERED",
      },
      {
        recipient: "student.marcus@campus.edu",
        subject: "🎉 Application Confirmed — Google Developer Student Club",
        template: "APPLICATION_SUBMITTED",
        htmlBody: "Your application has been received and queued for screening.",
        status: "DELIVERED",
      },
    ],
  });

  console.log("🌱 Database seeded successfully with realistic campus data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

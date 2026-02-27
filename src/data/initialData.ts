import type { ResumeData } from "../types/resume";

export const initialData: ResumeData = {
  personal: {
    photo: "/profile.jpg",

    firstName: "Leslie",
    lastName: "Knope",

    jobTitle:
      "Deputy Director of Parks and Recreations",

    email: "lknope@parksdept.com",
    phone: "317-660-2160",
    CurrentCity: "Pawnee",

    about: `My name is Leslie Knope. I am a passionate, over-achieving government employee who believes the government's #1 job is serving the people. By pairing the right people with the right messaging at the right time, the parks department and your local government can make the world a better place for everyone! I have met Joe Biden, and one day I will become the first female President of the United States.`,
  experienceLevel: "experienced",
experienceYears: 0,
experienceMonths: 0,

  
  },

  /* ================= EXPERIENCE ================= */

  experience: [
    {
      title: "Deputy Director Of Parks",
      CurrentCity: "Pawnee",
      from: "2008-02-01",
      to: "",
      current: true,
      company: "google",
      subtext: "",

      summary: `Led multiple city park development projects from planning to execution.
Managed cross-department coordination and community outreach programs.
Improved public engagement through strategic recreational initiatives.`,
    },

    {
      title: "City Councilor",
      CurrentCity: "Pawnee",
      from: "2012-01-01",
      to: "2018-01-01",
      current: false,
      company: "yahoo",
      subtext: "",

      summary: `Represented community interests in local government decisions.
Collaborated with city departments to improve civic services.
Drafted and supported policies focused on public welfare.`,
    },
  ],

  /* ================= EDUCATION ================= */

  education: [
    {
      school: "Indiana University",
      degree:
        "Bachelor of Public Administration",
      from: "2013-06-01",
      to: "2017-12-01",
      current: false,

      summary: `Specialized in Public Policy and Administration.
Participated in student governance and leadership programs.
Graduated with strong academic and civic performance.`,
    },
  ],

  /* ================= PROJECTS ================= */

  projects: [
    {
      title: "Parks Revamp Initiative",
      link: "https://pawneeparks.com",
      from: "",
      to: "",
      current: true,

      summary: `Led modernization of city park infrastructure.
Implemented sustainable recreational facilities.
Coordinated volunteers and municipal stakeholders.`,
    },
  ],

  /* ================= SKILLS ================= */

  skills: {
    technical: [
      "Microsoft Office",
      "Word",
      "Excel",
    ],

    soft: [
      "Leadership",
      "Public Speaking",
      "Team Management",
    ],

    languages: [
      "English: Native/Bilingual",
    ],

    interests: [
      "Politics",
      "Organizing Agendas",
      "Community Development",
    ],

     showTechnical: true,
  showSoft: true,
  showLanguages: true,
  showInterests: false,
  },
  
  /* ================= SOCIAL ================= */

  social: {
    linkedin: "leslieknope",
    twitter: "leslieknope",
    github: "",
    website: "MsKnope.com",
    show: true,
  },
};


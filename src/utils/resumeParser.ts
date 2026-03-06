// src/utils/resumeParser.ts
import type { ResumeData } from "../types/resume";

// ── FIND FUNCTIONS ────────────────────────────────────────

function findEmail(text: string): string {
  const match = text.match(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  return match ? match[0].trim() : "";
}

function findPhone(text: string): string {
  const match = text.match(/(\+?\d{1,3}[\s\-]?)?\(?\d{3,5}\)?[\s\-]?\d{3,5}[\s\-]?\d{3,5}/);
  return match ? match[0].trim() : "";
}

function findLinkedIn(text: string): string {
  let match = text.match(/linkedin\.com\/in\/([\w\-]+)/i);
  if (match) return match[1];
  match = text.match(/linkedin\s*[:\|]\s*([\w\-]+)/i);
  return match ? match[1] : "";
}

function findGitHub(text: string): string {
  let match = text.match(/github\.com\/([\w\-]+)/i);
  if (match) return match[1];
  match = text.match(/github\s*[:\|]\s*([\w\-]+)/i);
  return match ? match[1] : "";
}

function findWebsite(text: string): string {
  const match = text.match(/https?:\/\/((?!linkedin|github)[\w\-]+\.[\w.\-\/]+)/i);
  return match ? match[0] : "";
}

function findCity(text: string): string {
  const match = text.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)?),\s*(?:India|USA|UK|Canada|[A-Z]{2})/);
  return match ? match[1].trim() : "";
}

// ── NAME EXTRACTOR ────────────────────────────────────────

function extractName(headerText: string): { firstName: string; lastName: string } {
  const lines = headerText.split("\n").map(l => l.trim()).filter(Boolean);

  for (const line of lines) {
    // Skip lines with contact info
    if (line.includes("@") || line.match(/\d{7,}/) || line.includes("http") || line.includes("linkedin") || line.includes("github")) continue;

    // Strip title words from end
    const titleWords = ["frontend", "backend", "fullstack", "full stack", "software", "developer", "engineer", "manager", "designer", "analyst", "director", "lead", "architect", "senior", "junior", "intern"];
    let namePart = line;
    for (const word of titleWords) {
      const idx = namePart.toLowerCase().indexOf(word);
      if (idx > 0) { namePart = namePart.substring(0, idx).trim(); break; }
    }

    // Strip pipe and after
    namePart = namePart.split("|")[0].replace(/[,•\-]+$/, "").trim();

    const parts = namePart.split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts.length <= 5 && parts.every(p => /^[A-Za-z.]+$/.test(p))) {
      return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
    }
  }
  return { firstName: "", lastName: "" };
}

// ── JOB TITLE EXTRACTOR ───────────────────────────────────

function extractJobTitle(headerText: string): string {
  const lines = headerText.split("\n").map(l => l.trim()).filter(Boolean);
  const titlePattern = /(?:senior|junior|lead|staff|principal)?\s*(?:frontend|backend|fullstack|full[- ]stack|software|web|mobile|data|devops|cloud|ui\/ux|product)\s*(?:developer|engineer|architect|designer|analyst|manager|lead)/gi;

  for (const line of lines) {
    const match = line.match(titlePattern);
    if (match) return match[0].trim();
  }

  // Also try full text if not found in header
  return "";
}

// ── SECTION SPLITTER ──────────────────────────────────────

const SECTION_HEADERS: Record<string, string[]> = {
  summary:    ["professional summary", "summary", "about me", "objective", "profile", "about", "career objective"],
  skills:     ["technical skills", "skills", "core competencies", "technologies", "tech stack", "expertise", "key skills", "technical expertise"],
  experience: ["professional experience", "work experience", "experience", "employment history", "work history", "career history", "employment"],
  education:  ["education", "academic background", "qualifications", "academic history", "educational background"],
  projects:   ["projects", "personal projects", "key projects", "portfolio", "academic projects", "project experience"],
};

function splitSections(text: string): Record<string, string> {
  const sectionMap: Record<string, string> = {
    header: "", summary: "", skills: "", experience: "", education: "", projects: "",
  };

  const lines = text.split("\n");
  const matches: { lineIndex: number; section: string }[] = [];

  lines.forEach((line, i) => {
    const clean = line
      .replace(/[•·▪▸●\-_=*#]/g, "")
      .replace(/:/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    if (!clean || clean.length > 40) return;

    for (const [section, keywords] of Object.entries(SECTION_HEADERS)) {
      if (keywords.some(kw => clean === kw || clean === kw.toUpperCase().toLowerCase())) {
        matches.push({ lineIndex: i, section });
        break;
      }
    }
  });

  if (matches.length === 0) {
    sectionMap.header = text;
    return sectionMap;
  }

  sectionMap.header = lines.slice(0, matches[0].lineIndex).join("\n").trim();

  for (let i = 0; i < matches.length; i++) {
    const startLine = matches[i].lineIndex + 1;
    const endLine   = i + 1 < matches.length ? matches[i + 1].lineIndex : lines.length;
    sectionMap[matches[i].section] = lines.slice(startLine, endLine).join("\n").trim();
  }

  return sectionMap;
}

// ── SKILLS EXTRACTOR ─────────────────────────────────────

function extractSkills(skillsText: string): { technical: string[]; soft: string[] } {
  if (!skillsText) return { technical: [], soft: [] };

  const raw = skillsText
    .replace(/[•·▪▸✓●]/g, ",")
    .replace(/\|/g, ",")
    .split(/[,\n]+/)
    .map(s => s.replace(/\s+/g, " ").trim())
    .filter(s => s.length > 1 && s.length < 60);

  const techPattern = /react|angular|vue|node|python|java|typescript|javascript|html|css|sql|mongodb|git|aws|docker|redux|express|spring|figma|d3|elastic|material|bootstrap|tailwind|\bts\b|\bjs\b/i;
  const softWords   = /communication|leadership|teamwork|problem.solving|analytical|agile|scrum|collaboration|time management|adaptable/i;

  const technical: string[] = [];
  const soft: string[]      = [];
  const seen = new Set<string>();

  for (const s of raw) {
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    if (softWords.test(s)) {
      soft.push(s);
    } else if (s.includes(":")) {
      const parts = s.split(":")[1]?.split(",").map(p => p.trim()).filter(Boolean) || [];
      technical.push(...parts);
    } else {
      technical.push(s);
    }
  }

  return { technical, soft };
}

// ── DATE PARSER ───────────────────────────────────────────

function parseDate(str: string): string {
  if (!str || /present|current|now/i.test(str)) return "";
  const monthMap: Record<string, string> = {
    jan: "01", feb: "02", mar: "03", apr: "04",
    may: "05", jun: "06", jul: "07", aug: "08",
    sep: "09", oct: "10", nov: "11", dec: "12",
  };
  const yearMatch  = str.match(/\d{4}/);
  const monthMatch = str.toLowerCase().match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/);
  if (!yearMatch) return "";
  return `${yearMatch[0]}-${monthMatch ? monthMap[monthMatch[0]] : "01"}-01`;
}

// ── EXPERIENCE EXTRACTOR ──────────────────────────────────

function extractExperience(text: string) {
  if (!text) return [];
  const entries: any[] = [];
  const lines = text.split("\n").map(l => l.replace(/^[•·▪▸●\-]\s*/, "").replace(/\s+/g, " ").trim()).filter(Boolean);

  let current: any = null;
  const bulletLines: string[] = [];

  // Matches: "Nov 2024 – Present", "Jan 2020 - Dec 2022", "2019 - 2022"
  const dateRangePattern = /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\w\s,]*\d{4}|\d{4})\s*[-–—]+\s*(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[\w\s,]*\d{4}|\d{4}|present|current)/i;
  const titleWords = /developer|engineer|lead|manager|analyst|architect|intern|associate|director|designer|consultant|specialist|team lead/i;

  function pushCurrent() {
    if (current) {
      current.summary = bulletLines.join("\n");
      entries.push({ ...current });
      bulletLines.length = 0;
      current = null;
    }
  }

  for (const line of lines) {
    const dateMatch = line.match(dateRangePattern);

    if (dateMatch) {
      // New entry starts at a date range
      pushCurrent();
      current = { title: "", company: "", summary: "", from: "", to: "", current: false, CurrentCity: "", subtext: "" };
      current.from = parseDate(dateMatch[1]);
      const toStr = dateMatch[2];
      current.current = /present|current/i.test(toStr);
      current.to = current.current ? "" : parseDate(toStr);

      // Sometimes title + date on same line: "Frontend Developer | Nov 2024 – Present"
      const beforeDate = line.substring(0, dateMatch.index || 0).replace(/[|\-–]/g, "").trim();
      if (beforeDate && titleWords.test(beforeDate)) {
        current.title = beforeDate;
      }
    } else if (current && !current.title && titleWords.test(line) && line.length < 100) {
      current.title = line;
    } else if (current && !current.company && line.length < 80 && !line.includes(".") && line.split(" ").length <= 6) {
      current.company = line;
    } else if (current) {
      bulletLines.push(line);
    } else if (!current && titleWords.test(line) && line.length < 100) {
      // Title before date line
      current = { title: line, company: "", summary: "", from: "", to: "", current: false, CurrentCity: "", subtext: "" };
    }
  }

  pushCurrent();
  return entries.filter(e => e.title || e.company);
}

// ── EDUCATION EXTRACTOR ───────────────────────────────────

function extractEducation(text: string) {
  if (!text) return [];
  const entries: any[] = [];
  const lines = text.split("\n").map(l => l.replace(/\s+/g, " ").trim()).filter(Boolean);

  const degreeWords = /bachelor|master|phd|b\.?e\.?|b\.?tech|m\.?tech|mba|bsc|msc|diploma|degree|b\.?s\.?|m\.?s\.?|post.?graduate|under.?graduate/i;
  const datePattern = /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[\w\s,]*\d{4})\s*[-–—]+\s*(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?[\w\s,]*\d{4}|present)/i;

  let current: any = null;
  const summaryLines: string[] = [];

  for (const line of lines) {
    const dateMatch = line.match(datePattern);

    if (degreeWords.test(line)) {
      if (current) { current.summary = summaryLines.join("\n"); entries.push({ ...current }); summaryLines.length = 0; }
      current = { school: "", degree: line, from: "", to: "", current: false, summary: "" };
    } else if (dateMatch && current) {
      current.from = parseDate(dateMatch[1]);
      const toStr = dateMatch[2];
      current.current = /present/i.test(toStr);
      current.to = current.current ? "" : parseDate(toStr);
    } else if (current && !current.school && line.length > 3 && line.length < 100) {
      current.school = line;
    } else if (current) {
      summaryLines.push(line);
    }
  }

  if (current) { current.summary = summaryLines.join("\n"); entries.push(current); }
  return entries.filter(e => e.degree || e.school);
}

// ── PROJECTS EXTRACTOR ────────────────────────────────────

function extractProjects(text: string) {
  if (!text) return [];
  const entries: any[] = [];
  const lines = text.split("\n").map(l => l.replace(/^[•·▪▸●\-]\s*/, "").replace(/\s+/g, " ").trim()).filter(Boolean);
  const urlPattern = /https?:\/\/\S+/i;
  let current: any = null;
  const summaryLines: string[] = [];

  for (const line of lines) {
    const hasUrl = urlPattern.test(line);
    const isShort = line.length < 80 && line.split(" ").length <= 10 && !hasUrl && !line.includes(".");

    if (isShort) {
      if (current) { current.summary = summaryLines.join("\n"); entries.push({ ...current }); summaryLines.length = 0; }
      current = { title: line, link: "", from: "", to: "", current: true, summary: "" };
    } else if (hasUrl && current) {
      current.link = line.match(urlPattern)?.[0] || "";
    } else if (current) {
      summaryLines.push(line);
    }
  }

  if (current) { current.summary = summaryLines.join("\n"); entries.push(current); }
  return entries.filter(e => e.title);
}

// ── MAIN EXPORT ───────────────────────────────────────────

export function parseResumeText(rawText: string): Partial<ResumeData> {
  const sections = splitSections(rawText);

  const email    = findEmail(rawText);
  const phone    = findPhone(rawText);
  const linkedin = findLinkedIn(rawText);
  const github   = findGitHub(rawText);
  const website  = findWebsite(rawText);
  const city     = findCity(rawText);

  const { firstName, lastName } = extractName(sections.header || rawText);
  const jobTitle = extractJobTitle(sections.header || rawText) || extractJobTitle(rawText);
  const about    = sections.summary?.replace(/\s+/g, " ").trim() || "";

  const { technical, soft } = extractSkills(sections.skills);
  const experience = extractExperience(sections.experience);
  const education  = extractEducation(sections.education);
  const projects   = extractProjects(sections.projects);

  return {
    personal: {
      firstName,
      lastName,
      jobTitle,
      email,
      phone,
      CurrentCity: city,
      about,
      photo: "",
      experienceLevel: experience.length > 0 ? "experienced" : "fresher",
      experienceYears: 0,
      experienceMonths: 0,
    },
    experience,
    education,
    projects,
    skills: {
      technical,
      soft,
      languages: [],
      interests: [],
      showTechnical: true,
      showSoft:      soft.length > 0,
      showLanguages: false,
      showInterests: false,
    },
    social: {
      linkedin,
      github,
      twitter: "",
      website,
      show: !!(linkedin || github || website),
    },
  };
}

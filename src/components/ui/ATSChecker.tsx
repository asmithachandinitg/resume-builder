// src/components/ui/ATSChecker.tsx
import { useState } from "react";
import type { ResumeData } from "../../types/resume";
import type { InternshipEntry } from "../forms/InternshipForm";
import type { CustomSection } from "../forms/CustomSectionForm";
import "./ATSChecker.css";

interface Props {
  resumeData: ResumeData;
  internships: InternshipEntry[];
  customSections: CustomSection[];
}

// ── STOP WORDS ────────────────────────────────────────────
const STOP_WORDS = new Set([
  "the", "and", "for", "with", "you", "are", "this", "that",
  "have", "will", "from", "they", "your", "our", "has", "was",
  "but", "not", "all", "can", "her", "his", "its", "been",
  "more", "also", "into", "than", "then", "over", "such",
  "when", "who", "which", "use", "used", "using", "able",
  "work", "works", "worked", "working", "well", "good",
  "new", "one", "two", "may", "per", "etc", "inc", "llc",
]);

// ── TOKENIZE ──────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#\.]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// ── GET KEYWORDS ──────────────────────────────────────────
function getKeywords(text: string): Set<string> {
  return new Set(tokenize(text));
}

// ── EXTRACT RESUME TEXT ───────────────────────────────────
function extractResumeText(
  data: ResumeData,
  internships: InternshipEntry[],
  customSections: CustomSection[]
): string {
  const parts: string[] = [];

  // Personal
  const p = data.personal;
  parts.push(p.firstName, p.lastName, p.jobTitle, p.about);

  // Skills
  parts.push(
    ...(data.skills.technical || []),
    ...(data.skills.soft || []),
    ...(data.skills.languages || []),
    ...(data.skills.interests || [])
  );

  // Experience
  data.experience.forEach((e) => {
    parts.push(e.title, e.company, e.summary, e.subtext);
  });

  // Education
  data.education.forEach((e) => {
    parts.push(e.school, e.degree, e.summary);
  });

  // Projects
  data.projects.forEach((p) => {
    parts.push(p.title, p.summary);
  });

  // Internships
  internships.forEach((i: any) => {
    parts.push(i.title, i.company, i.summary);
  });

  // Custom sections
  customSections.forEach((s) => {
    parts.push(s.title);
    s.items?.forEach((item: any) => {
      parts.push(item.title, item.description);
    });
  });

  return parts.filter(Boolean).join(" ");
}

// ── SCORE ─────────────────────────────────────────────────
function calculateATS(resumeText: string, jobText: string) {
  const jobKeywords = getKeywords(jobText);
  const resumeKeywords = getKeywords(resumeText);

  const matched: string[] = [];
  const missing: string[] = [];

  jobKeywords.forEach((kw) => {
    if (resumeKeywords.has(kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  });

  const score =
    jobKeywords.size === 0
      ? 0
      : Math.round((matched.length / jobKeywords.size) * 100);

  return { score, matched, missing, total: jobKeywords.size };
}

// ── SCORE COLOR ───────────────────────────────────────────
function getScoreColor(score: number): string {
  if (score >= 75) return "#059669";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

function getScoreLabel(score: number): string {
  if (score >= 75) return "Strong Match";
  if (score >= 50) return "Moderate Match";
  if (score > 0)   return "Weak Match";
  return "No Match";
}

// ── COMPONENT ─────────────────────────────────────────────
export default function ATSChecker({
  resumeData,
  internships,
  customSections,
}: Props) {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<{
    score: number;
    matched: string[];
    missing: string[];
    total: number;
  } | null>(null);

  const handleCheck = () => {
    if (!jobDescription.trim()) return;
    const resumeText = extractResumeText(resumeData, internships, customSections);
    const res = calculateATS(resumeText, jobDescription);
    setResult(res);
  };

  const handleClear = () => {
    setJobDescription("");
    setResult(null);
  };

  return (
    <div className="ats-checker">

      {/* HEADER */}
      <div className="ats-header">
        <h3>ATS Score Checker</h3>
        <p>Paste a job description to see how well your resume matches.</p>
      </div>

      {/* JOB DESCRIPTION INPUT */}
      <div className="ats-input-group">
        <label>Job Description</label>
        <textarea
          className="ats-textarea"
          placeholder="Paste the full job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={8}
        />
        <div className="ats-input-actions">
          <button className="ats-clear-btn" onClick={handleClear}>
            Clear
          </button>
          <button
            className="ats-check-btn"
            onClick={handleCheck}
            disabled={!jobDescription.trim()}
          >
            Check ATS Score
          </button>
        </div>
      </div>

      {/* RESULTS */}
      {result && (
        <div className="ats-results">

          {/* SCORE CIRCLE */}
          <div className="ats-score-section">
            <div
              className="ats-score-circle"
              style={{
                background: `conic-gradient(${getScoreColor(result.score)} ${result.score * 3.6}deg, #f3f4f6 0deg)`,
              }}
            >
              <div className="ats-score-inner">
                <span className="ats-score-number" style={{ color: getScoreColor(result.score) }}>
                  {result.score}%
                </span>
                <span className="ats-score-label">ATS Score</span>
              </div>
            </div>

            <div className="ats-score-meta">
              <div
                className="ats-score-badge"
                style={{
                  background: getScoreColor(result.score) + "18",
                  color: getScoreColor(result.score),
                }}
              >
                {getScoreLabel(result.score)}
              </div>
              <p className="ats-score-detail">
                {result.matched.length} of {result.total} keywords matched
              </p>
              {result.score < 75 && (
                <p className="ats-tip">
                  💡 Add missing keywords to improve your score.
                </p>
              )}
              {result.score >= 75 && (
                <p className="ats-tip success">
                  ✅ Great match! Your resume is well optimized.
                </p>
              )}
            </div>
          </div>

          {/* MATCHED KEYWORDS */}
          {result.matched.length > 0 && (
            <div className="ats-keyword-section">
              <h4 className="ats-keyword-title matched-title">
                ✅ Matched Keywords ({result.matched.length})
              </h4>
              <div className="ats-chips">
                {result.matched.map((kw) => (
                  <span key={kw} className="ats-chip matched">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* MISSING KEYWORDS */}
          {result.missing.length > 0 && (
            <div className="ats-keyword-section">
              <h4 className="ats-keyword-title missing-title">
                ❌ Missing Keywords ({result.missing.length})
              </h4>
              <div className="ats-chips">
                {result.missing.map((kw) => (
                  <span key={kw} className="ats-chip missing">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

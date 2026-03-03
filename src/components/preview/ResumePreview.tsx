import type { ResumeData } from "../../types/resume";
import "./ResumePreview.css";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaGithub
} from "react-icons/fa";

import type { CustomSection } from "../forms/CustomSectionForm";
import type { InternshipEntry } from "../forms/InternshipForm";

const fontFamilyMap: Record<string, string> = {
  Inter: "Helvetica",
  Roboto: "Helvetica",
  Poppins: "Helvetica",
  Satoshi: "Helvetica",
};

const fontSizeMap: Record<string, string> = {
  small: "12px",
  medium: "14px",
  large: "16px",
};


type Props = {
  data: ResumeData;
  color: string;
  fontFamily: string;
  fontSize: string;
  customSections?: CustomSection[];
  internships?: InternshipEntry[];
};

function ResumePreview({
  data,
  color,
  fontFamily,
  fontSize,
  customSections = [],
  internships = [],
}: Props) {

  const {
    personal,
    experience,
    education,
    projects,
    skills,
    social,
  } = data;

  /* ================= COLOR ================= */

  const colorMap: Record<string, string> = {
    purple: "#6d28d9",
    blue: "#2563eb",
    green: "#059669",
    black: "#111827",
    pink: "#ec4899",
  };

  const themeColor =
    colorMap[color] || color || "#6d28d9";


  /* ================= DATE FORMAT ================= */

  const formatDate = (
    from?: string,
    to?: string,
    current?: boolean
  ) => {

    if (!from) return "";

    const f = new Date(from)
      .toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

    if (current) return `${f} — Present`;

    if (!to) return f;

    const t = new Date(to)
      .toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

    return `${f} — ${t}`;
  };

  /* ================= SKILLS VISIBILITY ================= */

  const showTechnical =
    skills.showTechnical &&
    skills.technical.length > 0;

  const showSoft =
    skills.showSoft &&
    skills.soft.length > 0;

  const showLanguages =
    skills.showLanguages &&
    skills.languages.length > 0;

  const showInterests =
    skills.showInterests &&
    skills.interests.length > 0;

  const hasSkills =
    showTechnical ||
    showSoft ||
    showLanguages ||
    showInterests;

  /* ================= UI ================= */

  return (
    <div className="resume-preview one-column"  style={{
      fontFamily: fontFamilyMap[fontFamily],
      fontSize: fontSizeMap[fontSize],
    }}>

      {/* ================= HEADER ================= */}

      <div className="preview-header">

        <div className="header-left">

          <h1 style={{ color: themeColor }}>
            {personal.firstName}{" "}
            {personal.lastName}
          </h1>

          <h3 className="job-title">
            {personal.jobTitle}
          </h3>

          <div
            className="about summary-html"
            dangerouslySetInnerHTML={{
              __html: personal.about,
            }}
          />

          {/* CONTACT + SOCIAL */}

          <div className="contact-grid">

            {personal.email && (
              <div className="contact-item">
                <FaEnvelope />
                <span>
                  {personal.email}
                </span>
              </div>
            )}

            {social.show &&
              social.linkedin && (
                <div className="contact-item">
                  <FaLinkedin />
                  <a
                    href={social.linkedin}
                    target="_blank"
                  >
                    linkedin
                  </a>
                </div>
              )}

            {social.show &&
              social.twitter && (
                <div className="contact-item">
                  <FaTwitter />
                  <a
                    href={social.twitter}
                    target="_blank"
                  >
                    twitter
                  </a>
                </div>
              )}

            {personal.phone && (
              <div className="contact-item">
                <FaPhone />
                <span>
                  {personal.phone}
                </span>
              </div>
            )}

            {personal.CurrentCity && (
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>
                  {personal.CurrentCity}
                </span>
              </div>
            )}

            {social.show &&
              social.github && (
                <div className="contact-item">
                  <FaGithub />
                  <a
                    href={social.github}
                    target="_blank"
                  >
                    GitHub
                  </a>
                </div>
              )}

            {social.show &&
              social.website && (
                <div className="contact-item">
                  <FaGlobe />
                  <a
                    href={social.website}
                    target="_blank"
                  >
                    Website
                  </a>
                </div>
              )}

          </div>

        </div>

        {/* PHOTO */}

        {personal.photo && (
          <img
            src={personal.photo}
            className="preview-photo"
          />
        )}

      </div>

      {/* ================= SKILLS ================= */}

      {hasSkills && (
        <>
          <SectionTitle
            title="SKILLS / INTERESTS"
            color={themeColor}
          />

          <div className="skills-inline">

            {showTechnical && (
              <p>
                <b>Technical Skills:</b>{" "}
                {skills.technical.join(", ")}
              </p>
            )}

            {showSoft && (
              <p>
                <b>Soft Skills:</b>{" "}
                {skills.soft.join(", ")}
              </p>
            )}

            {showLanguages && (
              <p>
                <b>Languages:</b>{" "}
                {skills.languages.join(", ")}
              </p>
            )}

            {showInterests && (
              <p>
                <b>Interests:</b>{" "}
                {skills.interests.join(", ")}
              </p>
            )}

          </div>
        </>
      )}

      {/* ================= EXPERIENCE ================= */}

      {experience.length > 0 && (
        <>
          <SectionTitle
            title="EXPERIENCE"
            color={themeColor}
          />

          {experience.map((exp, i) => (
            <div key={i} className="block">

              {/* Company name as top line */}
              {(exp as any).company && (
                <div className="row-2" style={{ marginBottom: 2 }}>
                  <b className="left" style={{ fontSize: "1.05em" }}>
                    {(exp as any).company}
                  </b>
                  <span className="right" style={{ color: "#6b7280" }}>
                    {formatDate(exp.from, exp.to, exp.current)}
                  </span>
                </div>
              )}

              <div className="row-3">
                <span className="left" style={{ color: "#374151" }}>
                  {exp.title}
                </span>

                <span className="center">
                  {exp.CurrentCity}
                </span>

                {/* Only show date here if no company name shown above */}
                {!(exp as any).company && (
                  <span className="right">
                    {formatDate(exp.from, exp.to, exp.current)}
                  </span>
                )}
              </div>

              {/* Subtext */}
              {(exp as any).subtext && (
                <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em", fontStyle: "italic" }}>
                  {(exp as any).subtext}
                </p>
              )}

              <div
                className="summary-html"
                dangerouslySetInnerHTML={{
                  __html: exp.summary,
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* ================= INTERNSHIP ================= */}

      {internships.length > 0 && (
        <>
          <SectionTitle
            title="INTERNSHIP"
            color={themeColor}
          />

          {internships.map((intern, i) => (
            <div key={i} className="block">

              {intern.company && (
                <div className="row-2" style={{ marginBottom: 2 }}>
                  <b className="left" style={{ fontSize: "1.05em" }}>
                    {intern.company}
                  </b>
                  <span className="right" style={{ color: "#6b7280" }}>
                    {formatDate(intern.from, intern.to, intern.current)}
                  </span>
                </div>
              )}

              <div className="row-3">
                <span className="left" style={{ color: "#374151" }}>
                  {intern.title}
                </span>
                <span className="center">{intern.CurrentCity}</span>
                {!intern.company && (
                  <span className="right">
                    {formatDate(intern.from, intern.to, intern.current)}
                  </span>
                )}
              </div>

              {intern.subtext && (
                <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em", fontStyle: "italic" }}>
                  {intern.subtext}
                </p>
              )}

              <div
                className="summary-html"
                dangerouslySetInnerHTML={{ __html: intern.summary }}
              />
            </div>
          ))}
        </>
      )}

      {/* ================= EDUCATION ================= */}

      {education.length > 0 && (
        <>
          <SectionTitle
            title="EDUCATION"
            color={themeColor}
          />

          {education.map((edu, i) => (
            <div key={i} className="block">

              <div className="row-3">

                <b className="left">
                  {edu.school}
                </b>

                <span className="center">
                  {(edu as any).location || ""}
                </span>

                <span className="right">
                  {formatDate(
                    edu.from,
                    edu.to,
                    edu.current
                  )}
                </span>

              </div>

              {edu.degree && (
                <p style={{ margin: "2px 0 2px", color: "#374151" }}>
                  {edu.degree}
                </p>
              )}

              {/* Subtext only if filled */}
              {(edu as any).subtext && (
                <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em", fontStyle: "italic" }}>
                  {(edu as any).subtext}
                </p>
              )}

              <div
                className="summary-html"
                dangerouslySetInnerHTML={{
                  __html: edu.summary,
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* ================= PROJECTS ================= */}

      {projects.length > 0 && (
        <>
          <SectionTitle
            title="PROJECTS"
            color={themeColor}
          />

          {projects.map((proj, i) => (
            <div key={i} className="block">

              <div className="row-2">

                <b className="left">
                  {proj.title}
                </b>

                {proj.link && (
                  <a
                    href={proj.link}
                    target="_blank"
                    className="right"

                  >
                    {proj.link}
                  </a>
                )}

              </div>

              <div
                className="summary-html"
                dangerouslySetInnerHTML={{
                  __html: proj.summary,
                }}
              />

            </div>
          ))}
        </>
      )}

      {/* ================= CUSTOM SECTIONS ================= */}

      {customSections.map((section, si) =>
        section.title || section.items.length > 0 ? (
          <div key={si}>
            <SectionTitle
              title={section.title.toUpperCase() || "CUSTOM SECTION"}
              color={themeColor}
            />

            {section.items.map((item, ii) => (
              <div key={ii} className="block">
                {item.heading && (
                  <div className="row-2">
                    <b className="left">{item.heading}</b>
                  </div>
                )}
                {item.subtext && (
                  <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em", fontStyle: "italic" }}>
                    {item.subtext}
                  </p>
                )}
                {item.summary && (
                  <div
                    className="summary-html"
                    dangerouslySetInnerHTML={{ __html: item.summary }}
                  />
                )}
              </div>
            ))}
          </div>
        ) : null
      )}

    </div>
  );
}

/* ================= TITLE ================= */

function SectionTitle({
  title,
  color,
}: any) {
  return (
    <div
      className="section-title"
      style={{
        borderBottom: `2px solid ${color}`,
        color,
      }}
    >
      {title}
    </div>
  );
}

export default ResumePreview;

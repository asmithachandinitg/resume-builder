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

const fontFamilyMap: Record<string, string> = {
  Satoshi: "Satoshi, sans-serif",
  Inter: "Inter, sans-serif",
  Poppins: "Poppins, sans-serif",
  Roboto: "Roboto, sans-serif",
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
};

function ResumePreview({
  data,
  color,
    fontFamily,
  fontSize,
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

              <div className="row-3">

                <b className="left">
                  {exp.title}
                </b>

                <span className="center">
                  {exp.CurrentCity}
                </span>

                <span className="right">
                  {formatDate(
                    exp.from,
                    exp.to,
                    exp.current
                  )}
                </span>

              </div>
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
                  {edu.degree}
                </b>

                <span className="center">
                  {edu.school}
                </span>

                <span className="right">
                  {formatDate(
                    edu.from,
                    edu.to,
                    edu.current
                  )}
                </span>

              </div>

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

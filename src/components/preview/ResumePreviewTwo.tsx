import type { ResumeData } from "../../types/resume";
import "./ResumePreviewTwo.css";

import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaGithub,
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

function ResumePreviewTwo({
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
    <div className="resume-two" style={{
      fontFamily: fontFamilyMap[fontFamily],
      fontSize: fontSizeMap[fontSize],
    }}>

      {/* ================= SIDEBAR ================= */}

      <div className="sidebar">

        {personal.photo && (
          <img
            src={personal.photo}
            className="photo"
          />
        )}

        <h2>
          {personal.firstName}{" "}
          {personal.lastName}
        </h2>

        <p className="job">
          {personal.jobTitle}
        </p>

        {/* CONTACT */}

        {(personal.email ||
          personal.phone ||
          personal.CurrentCity) && (
            <>
              <SectionTitle
                title="Contact"
                color={themeColor}
              />

              <div className="contact-side">

                {personal.email && (
                  <p>
                    <FaEnvelope />{" "}
                    {personal.email}
                  </p>
                )}

                {personal.phone && (
                  <p>
                    <FaPhone />{" "}
                    {personal.phone}
                  </p>
                )}

                {personal.CurrentCity && (
                  <p>
                    <FaMapMarkerAlt />{" "}
                    {personal.CurrentCity}
                  </p>
                )}

              </div>
            </>
          )}

        {/* ================= SKILLS ================= */}

        {hasSkills && (
          <>
            <SectionTitle
              title="Skills"
              color={themeColor}
            />

            {/* TECHNICAL */}

            {showTechnical && (
              <div className="skills-side">
                {skills.technical.map(
                  (s, i) => (
                    <span
                      key={i}
                      className="chip"
                    >
                      {s}
                    </span>
                  )
                )}
              </div>
            )}

            {/* SOFT */}

            {showSoft && (
              <>
                <SectionTitle
                  title="Soft Skills"
                  color={themeColor}
                />

                <ul className="side-list">
                  {skills.soft.map(
                    (s, i) => (
                      <li key={i}>
                        {s}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}

            {/* LANGUAGES */}

            {showLanguages && (
              <>
                <SectionTitle
                  title="Languages"
                  color={themeColor}
                />

                <ul className="side-list">
                  {skills.languages.map(
                    (l, i) => (
                      <li key={i}>
                        {l}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}

            {/* INTERESTS */}

            {showInterests && (
              <>
                <SectionTitle
                  title="Interests"
                  color={themeColor}
                />

                <ul className="side-list">
                  {skills.interests.map(
                    (l, i) => (
                      <li key={i}>
                        {l}
                      </li>
                    )
                  )}
                </ul>
              </>
            )}
          </>
        )}

        {/* ================= SOCIAL ================= */}

        {social.show &&
          (social.linkedin ||
            social.twitter ||
            social.github ||
            social.website) && (
            <>
              <SectionTitle
                title="Social"
                color={themeColor}
              />

              <div className="contact-side">

                {social.linkedin && (
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

                {social.twitter && (
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

                {social.github && (
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

                {social.website && (
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
            </>
          )}

      </div>

      {/* ================= MAIN ================= */}

      <div className="main">

        {/* ABOUT */}

        {personal.about && (
          <>
            <SectionTitle
              title="About Me"
              color={themeColor}
            />

            <div
              className="summary-html"
              dangerouslySetInnerHTML={{
                __html: personal.about,
              }}
            />
          </>
        )}

        {/* EXPERIENCE */}

        {experience.length > 0 && (
          <>
            <SectionTitle
              title="Experience"
              color={themeColor}
            />

            {experience.map(
              (exp, i) => (
                <div
                  key={i}
                  className="block"
                >

                  <div className="row-3">
                    <b>{exp.title}</b>

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
              )
            )}
          </>
        )}

        {/* EDUCATION */}

        {education.length > 0 && (
          <>
            <SectionTitle
              title="Education"
              color={themeColor}
            />

            {education.map((edu, i) => (
              <div key={i} className="block">

                <div className="row-3">

                  <b>{edu.degree}</b>

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

                {edu.summary && (
                  <div
                    className="summary-html"
                    dangerouslySetInnerHTML={{
                      __html: edu.summary,
                    }}
                  />

                )}

              </div>
            ))}
          </>
        )}

        {/* PROJECTS */}

        {projects.length > 0 && (
          <>
            <SectionTitle
              title="Projects"
              color={themeColor}
            />

            {projects.map(
              (p, i) => (
                <div
                  key={i}
                  className="block"
                >

                  <div className="row-2">
                    <b>{p.title}</b>

                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        className="right"
                      >
                        {p.link}
                      </a>
                    )}
                  </div>

                  <div
                    className="summary-html"
                    dangerouslySetInnerHTML={{
                      __html: p.summary,
                    }}
                  />
                </div>
              )
            )}
          </>
        )}

      </div>
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

export default ResumePreviewTwo;

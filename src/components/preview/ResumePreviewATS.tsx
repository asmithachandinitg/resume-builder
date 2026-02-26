import type { ResumeData } from "../../types/resume";
import "./ResumePreviewATS.css";

/* ================= FONT MAPS ================= */

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

function ResumePreviewATS({
  data,
  fontFamily,
  fontSize,
}: Props) {

  const {
    personal,
    experience,
    education,
    projects,
    skills,
  } = data;

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

    if (current) return `${f} – Present`;
    if (!to) return f;

    const t = new Date(to)
      .toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

    return `${f} – ${t}`;
  };

  /* ================= UI ================= */

  return (
    <div
      className="resume-preview ats"
      style={{
        fontFamily:
          fontFamilyMap[fontFamily],
        fontSize:
          fontSizeMap[fontSize],
      }}
    >

      {/* ===== HEADER ===== */}

      <h1 className="ats-name">
        {personal.firstName}{" "}
        {personal.lastName}
      </h1>

      <p className="ats-title">
        {personal.jobTitle}
      </p>

      <p className="ats-contact">
        {personal.email} •{" "}
        {personal.phone} •{" "}
        {personal.CurrentCity}
      </p>

      {/* ===== SUMMARY ===== */}

      {personal.about && (
        <>
          <SectionTitle title="Summary" />

          <div
            dangerouslySetInnerHTML={{
              __html: personal.about,
            }}
          />
        </>
      )}

      {/* ===== EXPERIENCE ===== */}

      {experience.length > 0 && (
        <>
          <SectionTitle title="Experience" />

          {experience.map((exp, i) => (
            <div key={i} className="ats-block">

              <div className="ats-row">
                <b>{exp.title}</b>
                <span>
                  {formatDate(
                    exp.from,
                    exp.to,
                    exp.current
                  )}
                </span>
              </div>

              <div
                dangerouslySetInnerHTML={{
                  __html: exp.summary,
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* ===== EDUCATION ===== */}

      {education.length > 0 && (
        <>
          <SectionTitle title="Education" />

          {education.map((edu, i) => (
            <div key={i} className="ats-block">

              <div className="ats-row">
                <b>{edu.degree}</b>
                <span>
                  {formatDate(
                    edu.from,
                    edu.to,
                    edu.current
                  )}
                </span>
              </div>

              <p>{edu.school}</p>

            </div>
          ))}
        </>
      )}

      {/* ===== SKILLS ===== */}

      {skills.technical.length > 0 && (
        <>
          <SectionTitle title="Skills" />

          <p>
            {skills.technical.join(", ")}
          </p>
        </>
      )}

      {/* ===== PROJECTS ===== */}

      {projects.length > 0 && (
        <>
          <SectionTitle title="Projects" />

          {projects.map((proj, i) => (
            <div key={i} className="ats-block">

              <b>{proj.title}</b>

              <div
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

/* ===== SECTION TITLE ===== */

function SectionTitle({
  title,
}: {
  title: string;
}) {
  return (
    <h2 className="ats-section">
      {title}
    </h2>
  );
}

export default ResumePreviewATS;

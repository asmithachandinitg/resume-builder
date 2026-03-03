import type { ResumeData } from "../../types/resume";
import "./ResumePreviewATS.css";
import type { CustomSection } from "../forms/CustomSectionForm";
import type { InternshipEntry } from "../forms/InternshipForm";

/* ================= FONT MAPS ================= */

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

function ResumePreviewATS({
  data,
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
        fontFamily: fontFamilyMap[fontFamily],
        fontSize: fontSizeMap[fontSize],
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

              {/* Company as first line */}
              {(exp as any).company && (
                <div className="ats-row">
                  <b>{(exp as any).company}</b>
                  <span>{formatDate(exp.from, exp.to, exp.current)}</span>
                </div>
              )}

              <div className="ats-row">
                <span style={{ color: "#374151" }}>{exp.title}{exp.CurrentCity ? ` · ${exp.CurrentCity}` : ""}</span>
                {!(exp as any).company && (
                  <span>{formatDate(exp.from, exp.to, exp.current)}</span>
                )}
              </div>

              {(exp as any).subtext && (
                <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em", fontStyle: "italic" }}>
                  {(exp as any).subtext}
                </p>
              )}

              <div
                dangerouslySetInnerHTML={{
                  __html: exp.summary,
                }}
              />
            </div>
          ))}
        </>
      )}

      {/* ===== INTERNSHIP ===== */}

      {internships.length > 0 && (
        <>
          <SectionTitle title="Internship" />

          {internships.map((intern, i) => (
            <div key={i} className="ats-block">

              {intern.company && (
                <div className="ats-row">
                  <b>{intern.company}</b>
                  <span>{formatDate(intern.from, intern.to, intern.current)}</span>
                </div>
              )}

              <div className="ats-row">
                <span style={{ color: "#374151" }}>
                  {intern.title}{intern.CurrentCity ? ` · ${intern.CurrentCity}` : ""}
                </span>
                {!intern.company && (
                  <span>{formatDate(intern.from, intern.to, intern.current)}</span>
                )}
              </div>

              {intern.subtext && (
                <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em", fontStyle: "italic" }}>
                  {intern.subtext}
                </p>
              )}

              <div dangerouslySetInnerHTML={{ __html: intern.summary }} />
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
      <b>{edu.school}</b>
      <span>{formatDate(edu.from, edu.to, edu.current)}</span>
    </div>
    <p style={{ margin: "2px 0" }}>
      {edu.degree}
      {(edu as any).location ? ` · ${(edu as any).location}` : ""}
    </p>
    {(edu as any).subtext && (
      <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em", fontStyle: "italic" }}>
        {(edu as any).subtext}
      </p>
    )}
    {edu.summary && (
      <div dangerouslySetInnerHTML={{ __html: edu.summary }} />
    )}
  </div>
))}
        </>
      )}

      {/* ===== SKILLS ===== */}

      {(skills.technical.length > 0 || skills.soft.length > 0 ||
        skills.languages.length > 0 || skills.interests.length > 0) && (
          <>
            <SectionTitle title="Skills" />
            {skills.showTechnical && skills.technical.length > 0 && (
              <p><b>Technical:</b> {skills.technical.join(", ")}</p>
            )}
            {skills.showSoft && skills.soft.length > 0 && (
              <p><b>Soft Skills:</b> {skills.soft.join(", ")}</p>
            )}
            {skills.showLanguages && skills.languages.length > 0 && (
              <p><b>Languages:</b> {skills.languages.join(", ")}</p>
            )}
            {skills.showInterests && skills.interests.length > 0 && (
              <p><b>Interests:</b> {skills.interests.join(", ")}</p>
            )}
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

      {/* ===== CUSTOM SECTIONS ===== */}

      {customSections.map((section, si) =>
        section.title || section.items.length > 0 ? (
          <div key={si}>
            <SectionTitle title={section.title || "Custom Section"} />

            {section.items.map((item, ii) => (
              <div key={ii} className="ats-block">
                {item.heading && <b>{item.heading}</b>}
                {item.subtext && (
                  <p style={{ margin: "2px 0 4px", color: "#6b7280", fontSize: "0.9em" }}>
                    {item.subtext}
                  </p>
                )}
                {item.summary && (
                  <div dangerouslySetInnerHTML={{ __html: item.summary }} />
                )}
              </div>
            ))}
          </div>
        ) : null
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

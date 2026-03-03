import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { ResumeData } from "../../types/resume";
import type { CustomSection } from "../forms/CustomSectionForm";
import type { InternshipEntry } from "../forms/InternshipForm";
import { htmlToTextBlocks } from "./htmlToTextBlocks";

const fontSizeMap: Record<string, number> = { small: 9, medium: 10, large: 11 };

const formatDate = (from?: string, to?: string, current?: boolean) => {
  if (!from) return "";
  const f = new Date(from).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (current) return `${f} – Present`;
  if (!to) return f;
  return `${f} – ${new Date(to).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
};

type Props = {
  data: ResumeData;
  color: string;
  fontFamily: string;
  fontSize: string;
  customSections?: CustomSection[];
  internships?: InternshipEntry[];
};

export default function ResumePDFATS({ data, fontSize, customSections = [], internships = [] }: Props) {
  const { personal, experience, education, projects, skills, social } = data;
  const fs = fontSizeMap[fontSize] || 10;

  const s = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: fs,
      color: "#111827",
      padding: "40px 44px",
      backgroundColor: "#ffffff",
      lineHeight: 1.55,
    },
    // Header — centered (matches .ats-name / .ats-title / .ats-contact)
    name: { fontSize: fs + 8, fontFamily: "Helvetica-Bold", textAlign: "center", marginBottom: 3 },
    jobTitle: { fontSize: fs - 0.5, textAlign: "center", color: "#6b7280", marginBottom: 5 },
    contactLine: { fontSize: fs - 1.5, textAlign: "center", color: "#6b7280", marginBottom: 4 },
    socialRow: { flexDirection: "row", justifyContent: "center", gap: 10, marginBottom: 10 },
    socialLink: { fontSize: fs - 2, color: "#2563eb" },
    // Section title — black border (matches .ats-section)
    sectionTitle: {
      fontSize: fs - 1,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 0.8,
      borderBottomWidth: 1.5,
      borderBottomColor: "#e5e7eb",
      paddingBottom: 3,
      marginTop: 12,
      marginBottom: 7,
      color: "#111827",
    },
    // Block
    block: { marginBottom: 9, fontSize: fs - 1, lineHeight: 1.55 },
    rowSpread: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    companyName: { fontFamily: "Helvetica-Bold", fontSize: fs - 0.5, flex: 1 },
    dateText: { fontSize: fs - 2, color: "#9ca3af" },
    titleText: { fontSize: fs - 1.5, color: "#374151", flex: 1 },
    subtextStyle: { fontSize: fs - 2, color: "#6b7280", fontFamily: "Helvetica-Oblique", marginBottom: 2 },
    bodyText: { fontSize: fs - 1.5, color: "#374151", lineHeight: 1.55 },
    bulletRow: { flexDirection: "row", marginBottom: 1, paddingLeft: 8 },
    bulletDot: { fontSize: fs - 1.5, color: "#374151", marginRight: 4, width: 8 },
    skillsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 3 },
    skillLabel: { fontFamily: "Helvetica-Bold", fontSize: fs - 1.5 },
    skillValue: { fontSize: fs - 1.5, color: "#374151" },
    bold: { fontFamily: "Helvetica-Bold" },
    italic: { fontFamily: "Helvetica-Oblique" },
    link: { fontSize: fs - 2, color: "#2563eb" },
  });

  const RichText = ({ html }: { html: string }) => {
    if (!html) return null;
    const blocks = htmlToTextBlocks(html);
    if (!blocks.length) return null;
    return (
      <View>
        {blocks.map((block, i) =>
          block.bullet ? (
            <View key={i} style={s.bulletRow}>
              <Text style={s.bulletDot}>•</Text>
              <Text style={[s.bodyText, block.bold ? s.bold : {}, block.italic ? s.italic : {}]}>
                {block.text}
              </Text>
            </View>
          ) : (
            <Text key={i} style={[s.bodyText, block.bold ? s.bold : {}, block.italic ? s.italic : {}, { marginBottom: 2 }]}>
              {block.text}
            </Text>
          )
        )}
      </View>
    );
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── HEADER ── */}
        <Text style={s.name}>{personal.firstName} {personal.lastName}</Text>
        {personal.jobTitle && <Text style={s.jobTitle}>{personal.jobTitle}</Text>}
        <Text style={s.contactLine}>
          {[personal.email, personal.phone, personal.CurrentCity].filter(Boolean).join("  •  ")}
        </Text>

        {social.show && (social.linkedin || social.github || social.twitter || social.website) && (
          <View style={s.socialRow}>
            {social.linkedin && <Link style={s.socialLink} src={social.linkedin}>LinkedIn</Link>}
            {social.github && <Link style={s.socialLink} src={social.github}>GitHub</Link>}
            {social.twitter && <Link style={s.socialLink} src={social.twitter}>Twitter</Link>}
            {social.website && <Link style={s.socialLink} src={social.website}>Website</Link>}
          </View>
        )}

        {/* ── SUMMARY ── */}
        {personal.about && (
          <View>
            <SectionTitle title="Summary" />
            <RichText html={personal.about} />
          </View>
        )}

        {/* ── EXPERIENCE ── */}
        {experience.length > 0 && (
          <View>
            <SectionTitle title="Experience" />
            {experience.map((exp, i) => (
              <View key={i} style={s.block} wrap={false}>
                {(exp as any).company && (
                  <View style={s.rowSpread}>
                    <Text style={s.companyName}>{(exp as any).company}</Text>
                    <Text style={s.dateText}>{formatDate(exp.from, exp.to, exp.current)}</Text>
                  </View>
                )}
                <View style={s.rowSpread}>
                  <Text style={s.titleText}>{exp.title}{exp.CurrentCity ? `  ·  ${exp.CurrentCity}` : ""}</Text>
                  {!(exp as any).company && <Text style={s.dateText}>{formatDate(exp.from, exp.to, exp.current)}</Text>}
                </View>
                {(exp as any).subtext && <Text style={s.subtextStyle}>{(exp as any).subtext}</Text>}
                <RichText html={exp.summary} />
              </View>
            ))}
          </View>
        )}

        {/* ── INTERNSHIP ── */}
        {internships.length > 0 && (
          <View>
            <SectionTitle title="Internship" />
            {internships.map((intern, i) => (
              <View key={i} style={s.block} wrap={false}>
                {intern.company && (
                  <View style={s.rowSpread}>
                    <Text style={s.companyName}>{intern.company}</Text>
                    <Text style={s.dateText}>{formatDate(intern.from, intern.to, intern.current)}</Text>
                  </View>
                )}
                <View style={s.rowSpread}>
                  <Text style={s.titleText}>{intern.title}{intern.CurrentCity ? `  ·  ${intern.CurrentCity}` : ""}</Text>
                  {!intern.company && <Text style={s.dateText}>{formatDate(intern.from, intern.to, intern.current)}</Text>}
                </View>
                {intern.subtext && <Text style={s.subtextStyle}>{intern.subtext}</Text>}
                <RichText html={intern.summary} />
              </View>
            ))}
          </View>
        )}

        {/* ── EDUCATION ── */}
        {education.length > 0 && (
          <View>
            <SectionTitle title="EDUCATION" />
            {education.map((edu, i) => (
              <View key={i} style={s.block} wrap={false}>
                {(edu as any).company && (
                  <View style={s.rowSpread}>
                    <Text style={s.companyName}>{(edu.school)}</Text>
                    <Text style={s.dateText}>{formatDate(edu.from, edu.to, edu.current)}</Text>
                  </View>
                )}
                <View style={s.rowSpread}>
                  <Text style={s.titleText}>{edu.degree}{(edu as any).location ? `  ·  ${(edu as any).location}` : ""}</Text>
                  {!(edu as any).company && <Text style={s.dateText}>{formatDate(edu.from, edu.to, edu.current)}</Text>}
                </View>
                {(edu as any).subtext && <Text style={s.subtextStyle}>{(edu as any).subtext}</Text>}
                <RichText html={edu.summary} />
              </View>
            ))}
          </View>
        )}

        {/* ── SKILLS ── */}
        {(skills.technical.length > 0 || skills.soft.length > 0 || skills.languages.length > 0 || skills.interests.length > 0) && (
          <View>
            <SectionTitle title="Skills" />
            {skills.showTechnical && skills.technical.length > 0 && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Technical:  </Text>
                <Text style={s.skillValue}>{skills.technical.join(", ")}</Text>
              </View>
            )}
            {skills.showSoft && skills.soft.length > 0 && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Soft Skills:  </Text>
                <Text style={s.skillValue}>{skills.soft.join(", ")}</Text>
              </View>
            )}
            {skills.showLanguages && skills.languages.length > 0 && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Languages:  </Text>
                <Text style={s.skillValue}>{skills.languages.join(", ")}</Text>
              </View>
            )}
            {skills.showInterests && skills.interests.length > 0 && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Interests:  </Text>
                <Text style={s.skillValue}>{skills.interests.join(", ")}</Text>
              </View>
            )}
          </View>
        )}

        {/* ── PROJECTS ── */}
        {projects.length > 0 && (
          <View>
            <SectionTitle title="Projects" />
            {projects.map((proj, i) => (
              <View key={i} style={s.block} wrap={false}>
                <View style={s.rowSpread}>
                  <Text style={s.companyName}>{proj.title}</Text>
                  {proj.link && <Link style={s.link} src={proj.link}>{proj.link}</Link>}
                </View>
                <RichText html={proj.summary} />
              </View>
            ))}
          </View>
        )}

        {/* ── CUSTOM SECTIONS ── */}
        {customSections.map((section, si) =>
          section.title || section.items.length > 0 ? (
            <View key={si}>
              <SectionTitle title={section.title || "Custom Section"} />
              {section.items.map((item, ii) => (
                <View key={ii} style={s.block} wrap={false}>
                  {item.heading && <Text style={s.companyName}>{item.heading}</Text>}
                  {item.subtext && <Text style={s.subtextStyle}>{item.subtext}</Text>}
                  <RichText html={item.summary} />
                </View>
              ))}
            </View>
          ) : null
        )}

      </Page>
    </Document>
  );
}

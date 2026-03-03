import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import type { ResumeData } from "../../types/resume";
import type { CustomSection } from "../forms/CustomSectionForm";
import type { InternshipEntry } from "../forms/InternshipForm";
import { htmlToTextBlocks } from "./htmlToTextBlocks";

const colorMap: Record<string, string> = {
  purple: "#6d28d9", blue: "#2563eb", green: "#059669", black: "#111827", pink: "#ec4899",
};
const fontSizeMap: Record<string, number> = { small: 9, medium: 10, large: 11 };

const formatDate = (from?: string, to?: string, current?: boolean) => {
  if (!from) return "";
  const f = new Date(from).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  if (current) return `${f} — Present`;
  if (!to) return f;
  return `${f} — ${new Date(to).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
};

type Props = {
  data: ResumeData;
  color: string;
  fontFamily: string;
  fontSize: string;
  customSections?: CustomSection[];
  internships?: InternshipEntry[];
};

export default function ResumePDFOne({ data, color, fontSize, customSections = [], internships = [] }: Props) {
  const { personal, experience, education, projects, skills, social } = data;
  const theme = colorMap[color] ?? color ?? "#6d28d9";
  const fs = fontSizeMap[fontSize] || 10;

  const s = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: fs,
      color: "#1f2937",
      padding: "40px 44px",
      backgroundColor: "#ffffff",
      lineHeight: 1.5,
    },
    name: { fontSize: fs + 10, fontFamily: "Helvetica-Bold", color: theme, marginBottom: 3, lineHeight: 1.2 },
    jobTitle: { fontSize: fs - 0.5, color: "#6b7280", marginBottom: 8 },
    about: { fontSize: fs - 1, color: "#374151", marginBottom: 10, lineHeight: 1.55 },
    contactRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 4 },
    contactItem: { fontSize: fs - 2, color: "#374151" },
    contactDot: { fontSize: fs - 2, color: "#6b7280" },
    link: { fontSize: fs - 2, color: theme, textDecoration: "none" },
    sectionTitle: {
      fontSize: fs - 1,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 0.8,
      color: theme,
      borderBottomWidth: 1.5,
      borderBottomColor: theme,
      paddingBottom: 3,
      marginTop: 14,
      marginBottom: 8,
    },
    block: { marginBottom: 10 },
    rowSpread: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 2 },
    companyName: { fontFamily: "Helvetica-Bold", fontSize: fs, flex: 1 },
    dateText: { fontSize: fs - 2, color: "#9ca3af", whiteSpace: "nowrap" },
    titleText: { fontSize: fs - 1, color: "#374151", flex: 1 },
    cityText: { fontSize: fs - 2, color: "#6b7280" },
    subtextStyle: { fontSize: fs - 2, color: "#6b7280", fontFamily: "Helvetica-Oblique", marginBottom: 2 },
    bodyText: { fontSize: fs - 1, color: "#374151", lineHeight: 1.6 },
    bulletRow: { flexDirection: "row", marginBottom: 1, paddingLeft: 8 },
    bulletDot: { fontSize: fs - 1, color: "#374151", marginRight: 4, width: 8 },
    skillsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 2 },
    skillLabel: { fontFamily: "Helvetica-Bold", fontSize: fs - 1 },
    skillValue: { fontSize: fs - 1, color: "#374151" },
    bold: { fontFamily: "Helvetica-Bold" },
    italic: { fontFamily: "Helvetica-Oblique" },
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
    <Text style={s.sectionTitle}>{title}</Text>
  );

  const showTechnical = skills.showTechnical && skills.technical.length > 0;
  const showSoft = skills.showSoft && skills.soft.length > 0;
  const showLanguages = skills.showLanguages && skills.languages.length > 0;
  const showInterests = skills.showInterests && skills.interests.length > 0;
  const hasSkills = showTechnical || showSoft || showLanguages || showInterests;

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={{ marginBottom: 14 }}>
          <Text style={s.name}>{personal.firstName} {personal.lastName}</Text>
          <Text style={s.jobTitle}>{personal.jobTitle}</Text>
          {personal.about && (
            <View style={{ marginBottom: 10 }}>
              <RichText html={personal.about} />
            </View>
          )}

          <View style={s.contactRow}>
            {personal.email && <Text style={s.contactItem}>{personal.email}</Text>}
            {personal.phone && <><Text style={s.contactDot}> • </Text><Text style={s.contactItem}>{personal.phone}</Text></>}
            {personal.CurrentCity && <><Text style={s.contactDot}> • </Text><Text style={s.contactItem}>{personal.CurrentCity}</Text></>}
            {social.show && social.linkedin && <><Text style={s.contactDot}> • </Text><Link style={s.link} src={social.linkedin}>LinkedIn</Link></>}
            {social.show && social.github && <><Text style={s.contactDot}> • </Text><Link style={s.link} src={social.github}>GitHub</Link></>}
            {social.show && social.twitter && <><Text style={s.contactDot}> • </Text><Link style={s.link} src={social.twitter}>Twitter</Link></>}
            {social.show && social.website && <><Text style={s.contactDot}> • </Text><Link style={s.link} src={social.website}>Website</Link></>}
          </View>
        </View>

        {hasSkills && (
          <View>
            <SectionTitle title="SKILLS / INTERESTS" />
            {showTechnical && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Technical Skills: </Text>
                <Text style={s.skillValue}>{skills.technical.join(", ")}</Text>
              </View>
            )}
            {showSoft && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Soft Skills: </Text>
                <Text style={s.skillValue}>{skills.soft.join(", ")}</Text>
              </View>
            )}
            {showLanguages && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Languages: </Text>
                <Text style={s.skillValue}>{skills.languages.join(", ")}</Text>
              </View>
            )}
            {showInterests && (
              <View style={s.skillsRow}>
                <Text style={s.skillLabel}>Interests: </Text>
                <Text style={s.skillValue}>{skills.interests.join(", ")}</Text>
              </View>
            )}
          </View>
        )}

        {experience.length > 0 && (
          <View>
            <SectionTitle title="EXPERIENCE" />
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

        {internships.length > 0 && (
          <View>
            <SectionTitle title="INTERNSHIP" />
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

        {projects.length > 0 && (
          <View>
            <SectionTitle title="PROJECTS" />
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

        {customSections.map((section, si) =>
          section.title || section.items.length > 0 ? (
            <View key={si}>
              <SectionTitle title={section.title.toUpperCase() || "CUSTOM SECTION"} />
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

import { Document, Page, Text, View, StyleSheet, Link, Image } from "@react-pdf/renderer";
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

export default function ResumePDFTwo({ data, color, fontSize, customSections = [], internships = [] }: Props) {
  const { personal, experience, education, projects, skills, social } = data;
  const theme = colorMap[color] ?? color ?? "#6d28d9";
  const fs = fontSizeMap[fontSize] || 10;

  const s = StyleSheet.create({
    page: {
      fontFamily: "Helvetica",
      fontSize: fs,
      color: "#1f2937",
      backgroundColor: "#ffffff",
      flexDirection: "row",
      lineHeight: 1.5,

    },

    // ── SIDEBAR BACKGROUND ──
    sidebarBg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 180,
      height: "100%",
      backgroundColor: "#f8f6ff",
    },
    // ── SIDEBAR CONTENT ──
    sidebar: {
      width: 180,
      flexShrink: 0,
      flexGrow: 0,
      paddingHorizontal: 14,
    },

    // ── MAIN ──
    main: {
      flex: 1,
      paddingLeft: 24,
      paddingRight: 20,
    },

    // Sidebar elements
    sidebarName: {
      fontSize: fs + 5,
      fontFamily: "Helvetica-Bold",
      color: "#111827",
      marginBottom: 2,
      lineHeight: 1.2,
    },
    photo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      marginBottom: 10,
      alignSelf: "center",
    },
    sidebarJob: {
      fontSize: fs - 2,
      color: "#6b7280",
      marginBottom: 10,
      lineHeight: 1.4,
    },
    sideSection: {
      fontSize: fs - 2,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 0.5,
      color: theme,
      borderBottomWidth: 1,
      borderBottomColor: theme,
      paddingBottom: 2,
      marginTop: 10,
      marginBottom: 5,
    },
    contactItem: {
      fontSize: fs - 2,
      color: "#374151",
      marginBottom: 3,
      lineHeight: 1.4,
    },
    // Chips (technical skills)
    chipsRow: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
      backgroundColor: "#ede9fe",
      color: "#5b21b6",
      fontSize: fs - 3,
      fontFamily: "Helvetica-Bold",
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 99,
      marginRight: 3,
      marginBottom: 3,
    },
    sideListItem: {
      fontSize: fs - 2,
      color: "#374151",
      marginBottom: 2,
    },
    sideLink: {
      fontSize: fs - 2,
      color: theme,
      marginBottom: 3,
    },

    // Main elements
    sectionTitle: {
      fontSize: fs - 1,
      fontFamily: "Helvetica-Bold",
      letterSpacing: 0.7,
      color: theme,
      borderBottomWidth: 1.5,
      borderBottomColor: theme,
      paddingBottom: 3,
      marginTop: 12,
      marginBottom: 6,
    },
    block: { marginBottom: 9 },
    rowSpread: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 1,
    },
    companyName: { fontFamily: "Helvetica-Bold", fontSize: fs, flex: 1 },
    dateText: { fontSize: fs - 2, color: "#9ca3af", flexShrink: 0 },
    titleText: { fontSize: fs - 1, color: "#374151", flex: 1 },
    subtextStyle: {
      fontSize: fs - 2,
      color: "#6b7280",
      fontFamily: "Helvetica-Oblique",
      marginBottom: 2,
    },
    bodyText: { fontSize: fs - 1, color: "#374151", lineHeight: 1.6 },
    bulletRow: { flexDirection: "row", marginBottom: 1, paddingLeft: 6 },
    bulletDot: { fontSize: fs - 1, color: "#374151", marginRight: 4, width: 8 },
    bold: { fontFamily: "Helvetica-Bold" },
    italic: { fontFamily: "Helvetica-Oblique" },
    link: { fontSize: fs - 2, color: theme },
  });

  const RichText = ({ html }: { html: string }) => {
    if (!html) return null;
    const blocks = htmlToTextBlocks(html);
    if (!blocks.length) return null;
    return (
      <View style={{ marginTop: 2 }}>
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

  const MainSection = ({ title }: { title: string }) => <Text style={s.sectionTitle}>{title}</Text>;
  const SideSection = ({ title }: { title: string }) => <Text style={s.sideSection}>{title}</Text>;

  const showTechnical = skills.showTechnical && skills.technical.length > 0;
  const showSoft = skills.showSoft && skills.soft.length > 0;
  const showLanguages = skills.showLanguages && skills.languages.length > 0;
  const showInterests = skills.showInterests && skills.interests.length > 0;

  return (
    <Document>
      <Page size="A4" style={s.page} wrap>

        {/* ══════════ SIDEBAR BACKGROUND (fixed = repeats every page) ══════════ */}
        <View style={s.sidebarBg} fixed />

        {/* ══════════ SIDEBAR CONTENT ══════════ */}
        <View style={s.sidebar}>

          {personal.photo && (
            <Image style={s.photo} src={personal.photo} />
          )}

          <Text style={s.sidebarName}>{personal.firstName} {personal.lastName}</Text>
          <Text style={s.sidebarJob}>{personal.jobTitle}</Text>

          {/* Contact */}
          {(personal.email || personal.phone || personal.CurrentCity) && (
            <View>
              <SideSection title="CONTACT" />
              {personal.email && <Text style={s.contactItem}>{personal.email}</Text>}
              {personal.phone && <Text style={s.contactItem}>{personal.phone}</Text>}
              {personal.CurrentCity && <Text style={s.contactItem}>{personal.CurrentCity}</Text>}
            </View>
          )}

          {/* Technical skills as chips */}
          {showTechnical && (
            <View>
              <SideSection title="SKILLS" />
              <View style={s.chipsRow}>
                {skills.technical.map((sk, i) => (
                  <Text key={i} style={s.chip}>{sk}</Text>
                ))}
              </View>
            </View>
          )}

          {showSoft && (
            <View>
              <SideSection title="SOFT SKILLS" />
              {skills.soft.map((sk, i) => (
                <Text key={i} style={s.sideListItem}>• {sk}</Text>
              ))}
            </View>
          )}

          {showLanguages && (
            <View>
              <SideSection title="LANGUAGES" />
              {skills.languages.map((l, i) => (
                <Text key={i} style={s.sideListItem}>• {l}</Text>
              ))}
            </View>
          )}

          {showInterests && (
            <View>
              <SideSection title="INTERESTS" />
              {skills.interests.map((l, i) => (
                <Text key={i} style={s.sideListItem}>• {l}</Text>
              ))}
            </View>
          )}

          {/* Social */}
          {social.show && (social.linkedin || social.github || social.twitter || social.website) && (
            <View>
              <SideSection title="SOCIAL" />
              {social.linkedin && <Link style={s.sideLink} src={social.linkedin}>LinkedIn</Link>}
              {social.github && <Link style={s.sideLink} src={social.github}>GitHub</Link>}
              {social.twitter && <Link style={s.sideLink} src={social.twitter}>Twitter</Link>}
              {social.website && <Link style={s.sideLink} src={social.website}>Website</Link>}
            </View>
          )}

        </View>

        {/* ══════════ MAIN ══════════ */}
        <View style={s.main}>

          {personal.about && (
            <View>
              <MainSection title="ABOUT ME" />
              <RichText html={personal.about} />
            </View>
          )}

          {experience.length > 0 && (
            <View>
              <MainSection title="EXPERIENCE" />
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
              <MainSection title="INTERNSHIP" />
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
              <MainSection title="EDUCATION" />
              {education.map((edu, i) => (
                <View key={i} style={s.block} wrap={false}>
                  <View style={s.rowSpread}>
                    <Text style={s.companyName}>{edu.school}</Text>
                    <Text style={s.dateText}>{formatDate(edu.from, edu.to, edu.current)}</Text>
                  </View>
                  {edu.degree && (
                    <Text style={[s.titleText, { marginBottom: 2 }]}>
                      {edu.degree}{(edu as any).location ? `  ·  ${(edu as any).location}` : ""}
                    </Text>
                  )}
                  {(edu as any).subtext && <Text style={s.subtextStyle}>{(edu as any).subtext}</Text>}
                  <RichText html={edu.summary} />
                </View>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View>
              <MainSection title="PROJECTS" />
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
                <MainSection title={section.title.toUpperCase() || "CUSTOM SECTION"} />
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

        </View>
      </Page>
    </Document>
  );
}

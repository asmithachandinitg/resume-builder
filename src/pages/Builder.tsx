import { useState } from "react";
import "./Builder.css";

import type { ResumeData } from "../types/resume";
import { initialData } from "../data/initialData";

/* FORMS */
import PersonalForm from "../components/forms/PersonalForm";
import ExperienceForm from "../components/forms/ExperienceForm";
import EducationForm from "../components/forms/EducationForm";
import SkillsForm from "../components/forms/SkillsForm";
import SocialForm from "../components/forms/SocialForm";
import ProjectsForm from "../components/forms/ProjectsForm";
import CustomSectionForm, { type CustomSection } from "../components/forms/CustomSectionForm";
import InternshipForm, { type InternshipEntry } from "../components/forms/InternshipForm";

/* PREVIEW */
import ResumePreview from "../components/preview/ResumePreview";
import ResumePreviewTwo from "../components/preview/ResumePreviewTwo";

/* ACCORDION */
import AccordionSection from "../components/ui/AccordionSection";

/* PDF */
import html2pdf from "html2pdf.js";
import { MdEdit } from "react-icons/md";
import { HiDocumentText } from "react-icons/hi2";
import { IoColorPaletteSharp } from "react-icons/io5";
import ResumePreviewATS from
"../components/preview/ResumePreviewATS";

/* EMPTY DATA */

const emptyData: ResumeData = {
    personal: {
        photo: "",
        firstName: "",
        lastName: "",
        jobTitle: "",
        email: "",
        phone: "",
        CurrentCity: "",
        about: "",
        experienceLevel: "experienced",
        experienceYears: 0,
        experienceMonths: 0,
    },

    experience: [],
    education: [],
    projects: [],

    skills: {
        technical: [],
        soft: [],
        languages: [],
        interests: [],
        showTechnical: true,
        showSoft: true,
        showLanguages: true,
        showInterests: false,
    },

    social: {
        linkedin: "",
        twitter: "",
        github: "",
        website: "",
        show: true,
    },
};

function Builder() {
    /* ================= STATE ================= */

    const [resumeData, setResumeData] =
        useState<ResumeData>(initialData);

    const [activeSection, setActiveSection] =
        useState<string | null>(null);

  const [layout, setLayout] =
  useState<"one" | "two" | "ats">("one");

    const [color, setColor] =
        useState("purple");

    const [fontFamily, setFontFamily] =
        useState("Satoshi");

    const [fontSize, setFontSize] =
        useState("medium");

    const [internships, setInternships] =
        useState<InternshipEntry[]>([]);

    const [customSections, setCustomSections] =
        useState<CustomSection[]>([]);

    /* NEW TAB STATE */

    const [activeTab, setActiveTab] =
        useState<
            "editor" | "templates" | "formatting"
        >("editor");

    /* COLOR MAP */

    const colorMap: Record<string, string> = {
        purple: "#6d28d9",
        blue: "#2563eb",
        green: "#059669",
        black: "#111827",
        pink: "#ec4899",
    };

    /* ================= ACTIONS ================= */

    const handleReset = () => {
        setResumeData(initialData);
    };

    const handleClear = () => {
        setResumeData(emptyData);
    };

    /* ================= PDF ================= */

    const handleDownloadPDF = () => {

  const fileName = prompt("Enter file name");

  if (fileName === null) return;

  if (!fileName.trim()) {
    alert("Please enter file name");
    return;
  }

  const element = document.querySelector(
    ".resume-preview, .resume-two"
  ) as HTMLElement;

  if (!element) return;

  const opt = {
    margin: 0,
    filename: `${fileName}.pdf`,

    image: {
      type: "jpeg" as const,
      quality: 1,
    },

    html2canvas: {
      scale: 2,
      useCORS: true,
    },

    jsPDF: {
      unit: "mm" as const,
      format: "a4" as const,
      orientation: "portrait" as const,
    },
  };

  html2pdf()
    .set(opt)
    .from(element)
    .save();
};
    /* ================= UI ================= */

    return (
        <div className="builder-container">
            {/* ========== LEFT PANEL ========== */}

            <div className="form-panel">
                {/* ===== TABS ===== */}

                <div className="builder-tabs">
                    <button
                        className={`tab ${activeTab === "editor"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            setActiveTab("editor")
                        }
                    >
                        <MdEdit style={{ color: "#6d28d9" }} /> Editor
                    </button>

                    <button
                        className={`tab ${activeTab === "templates"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            setActiveTab("templates")
                        }
                    >
                        <HiDocumentText style={{ color: "#15e420ff" }} /> Templates
                    </button>

                    <button
                        className={`tab ${activeTab === "formatting"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            setActiveTab("formatting")
                        }
                    >
                        <IoColorPaletteSharp style={{ color: "#e25b0dff" }} /> Formatting
                    </button>
                </div>

                {/* ========== EDITOR TAB ========== */}
                <div className="editor-tabs">
                    {activeTab === "editor" && (
                        <>
                            <AccordionSection
                                title="Personal Details"
                                isOpen={
                                    activeSection === "personal"
                                }
                                onToggle={() =>
                                    setActiveSection(
                                        activeSection ===
                                            "personal"
                                            ? null
                                            : "personal"
                                    )
                                }
                            >
                                <PersonalForm
                                    data={resumeData.personal}
                                    setData={(val) =>
                                        setResumeData({
                                            ...resumeData,
                                            personal: val,
                                        })
                                    }
                                />
                            </AccordionSection>

                            <AccordionSection
                                title="Skills"
                                isOpen={
                                    activeSection === "skills"
                                }
                                onToggle={() =>
                                    setActiveSection(
                                        activeSection === "skills"
                                            ? null
                                            : "skills"
                                    )
                                }
                            >
                                <SkillsForm
                                    data={resumeData.skills}
                                    setData={(val) =>
                                        setResumeData({
                                            ...resumeData,
                                            skills: val,
                                        })
                                    }
                                />
                            </AccordionSection>

                            <AccordionSection
                                title="Social"
                                isOpen={
                                    activeSection === "social"
                                }
                                onToggle={() =>
                                    setActiveSection(
                                        activeSection === "social"
                                            ? null
                                            : "social"
                                    )
                                }
                            >
                                <SocialForm
                                    data={resumeData.social}
                                    setData={(val) =>
                                        setResumeData({
                                            ...resumeData,
                                            social: val,
                                        })
                                    }
                                />
                            </AccordionSection>

                            {resumeData.personal
                                .experienceLevel !==
                                "fresher" && (
                                    <AccordionSection
                                        title="Experience"
                                        isOpen={
                                            activeSection ===
                                            "experience"
                                        }
                                        onToggle={() =>
                                            setActiveSection(
                                                activeSection ===
                                                    "experience"
                                                    ? null
                                                    : "experience"
                                            )
                                        }
                                    >
                                        <ExperienceForm
                                            data={
                                                resumeData.experience
                                            }
                                            setData={(val) =>
                                                setResumeData({
                                                    ...resumeData,
                                                    experience: val,
                                                })
                                            }
                                        />
                                    </AccordionSection>
                                )}

                            <AccordionSection
                                title="Education"
                                isOpen={
                                    activeSection ===
                                    "education"
                                }
                                onToggle={() =>
                                    setActiveSection(
                                        activeSection ===
                                            "education"
                                            ? null
                                            : "education"
                                    )
                                }
                            >
                                <EducationForm
                                    data={
                                        resumeData.education
                                    }
                                    setData={(val) =>
                                        setResumeData({
                                            ...resumeData,
                                            education: val,
                                        })
                                    }
                                />
                            </AccordionSection>

                            <AccordionSection
                                title="Projects"
                                isOpen={
                                    activeSection ===
                                    "projects"
                                }
                                onToggle={() =>
                                    setActiveSection(
                                        activeSection ===
                                            "projects"
                                            ? null
                                            : "projects"
                                    )
                                }
                            >
                                <ProjectsForm
                                    data={
                                        resumeData.projects
                                    }
                                    setData={(val) =>
                                        setResumeData({
                                            ...resumeData,
                                            projects: val,
                                        })
                                    }
                                />
                            </AccordionSection>

                            <AccordionSection
                                title="Internship"
                                isOpen={
                                    activeSection === "internship"
                                }
                                onToggle={() =>
                                    setActiveSection(
                                        activeSection === "internship"
                                            ? null
                                            : "internship"
                                    )
                                }
                            >
                                <InternshipForm
                                    data={internships}
                                    setData={setInternships}
                                />
                            </AccordionSection>

                            <AccordionSection
                                title="Custom Sections"
                                isOpen={
                                    activeSection === "custom"
                                }
                                onToggle={() =>
                                    setActiveSection(
                                        activeSection === "custom"
                                            ? null
                                            : "custom"
                                    )
                                }
                            >
                                <CustomSectionForm
                                    data={customSections}
                                    setData={setCustomSections}
                                />
                            </AccordionSection>
                        </>
                    )}

                    {/* ========== TEMPLATES TAB ========== */}

                    {activeTab === "templates" && (
                        <div className="settings-panel">
                            <h3>Layout Theme</h3>

                            <div className="chip-group">

                                <button
                                    className={`chip ${layout === "one" ? "active" : ""
                                        }`}
                                    onClick={() => setLayout("one")}
                                >
                                    One Column
                                </button>

                                <button
                                    className={`chip ${layout === "two" ? "active" : ""
                                        }`}
                                    onClick={() => setLayout("two")}
                                >
                                    Two Column
                                </button>

<button
  className={`chip ${
    layout === "ats" ? "active" : ""
  }`}
  onClick={() => setLayout("ats")}
>
  ATS Clean
</button>

                            </div>
                        </div>
                    )}

                    {/* ========== FORMATTING TAB ========== */}

                    {activeTab === "formatting" && (

                        <div className="formatting-card">

                            {/* ===== ACTIONS ===== */}

                            <div className="settings-actions">
                                <button onClick={handleReset}>
                                    Reset CV
                                </button>

                                <button onClick={handleClear}>
                                    Clear CV
                                </button>
                            </div>

                            {/* ===== FONT ROW ===== */}

                            <div className="formatting-row">

                                <div className="formatting-group">
                                    <label>Select font</label>

                                    <select
                                        className="formatting-select"
                                        value={fontFamily}
                                        onChange={(e) =>
                                            setFontFamily(e.target.value)
                                        }
                                    >
                                        <option value="Satoshi">Satoshi</option>
                                        <option value="Inter">Inter</option>
                                        <option value="Poppins">Poppins</option>
                                        <option value="Roboto">Roboto</option>
                                    </select>
                                </div>

                                <div className="formatting-group">
                                    <label>Font size</label>

                                    <select
                                        className="formatting-select"
                                        value={fontSize}
                                        onChange={(e) =>
                                            setFontSize(e.target.value)
                                        }
                                    >
                                        <option value="small">Small</option>
                                        <option value="medium">Medium</option>
                                        <option value="large">Large</option>
                                    </select>
                                </div>

                            </div>

                            {/* ===== THEME ===== */}


                            <div className="formatting-group">
                                <label>Theme</label>

                                <div className="theme-colors">

                                    {Object.entries(colorMap).map(
                                        ([name, value]) => {

                                            const isActive = color === name;

                                            return (
                                                <div
                                                    key={name}
                                                    className={`theme-circle ${isActive ? "active" : ""
                                                        }`}
                                                    style={{ background: value }}
                                                    onClick={() => setColor(name)}
                                                >
                                                    {isActive && "✓"}
                                                </div>
                                            );
                                        }
                                    )}

                                    {/* CUSTOM COLOR */}
                                    <label
                                        className={`theme-circle ${
                                            !Object.keys(colorMap).includes(color) ? "active" : ""
                                        }`}
                                        title="Custom color"
                                        style={{
                                            background: !Object.keys(colorMap).includes(color)
                                                ? color
                                                : "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)",
                                            cursor: "pointer",
                                            position: "relative",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {!Object.keys(colorMap).includes(color) && "✓"}
                                        <input
                                            type="color"
                                            value={!Object.keys(colorMap).includes(color) ? color : "#6d28d9"}
                                            onChange={(e) => setColor(e.target.value)}
                                            style={{
                                                position: "absolute",
                                                inset: 0,
                                                opacity: 0,
                                                cursor: "pointer",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </label>

                                </div>
                            </div>


                        </div>

                    )}

                    {/* DOWNLOAD */}

                    <div className="builder-actions">
                        <button
                            className="primary-btn"
                            onClick={handleDownloadPDF}
                        >
                            Download your CV as PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== PREVIEW ========== */}

        <div className="preview-panel">

  {layout === "one" && (
    <ResumePreview
      data={resumeData}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      internships={internships}
      customSections={customSections}
    />
  )}

  {layout === "two" && (
    <ResumePreviewTwo
      data={resumeData}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      internships={internships}
      customSections={customSections}
    />
  )}

  {layout === "ats" && (
    <ResumePreviewATS
      data={resumeData}
      color={color}
      fontFamily={fontFamily}
      fontSize={fontSize}
      internships={internships}
      customSections={customSections}
    />
  )}

</div>

        </div>
    );
}

export default Builder;

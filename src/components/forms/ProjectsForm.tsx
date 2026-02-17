import { useState } from "react";
import type { ResumeData } from "../../types/resume";

import {
  FaBriefcase,
  FaCalendarAlt,
  FaCalendarCheck,
  FaAlignLeft,
  FaTrash,
  FaAngleDown,
  FaAngleUp,
  FaLink,
} from "react-icons/fa";

import {
  Editor,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnBulletList,
  BtnNumberedList,
  BtnLink,
  EditorProvider,
} from "react-simple-wysiwyg";

type Project =
  ResumeData["projects"][number];

interface Props {
  data: Project[];
  setData: (val: Project[]) => void;
}

function ProjectsForm({
  data,
  setData,
}: Props) {

  /* ================= OPEN TRACK ================= */

  const [openIndexes, setOpenIndexes] =
    useState<number[]>([]);

  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  /* ================= ADD ================= */

  const addProject = () => {
    const newItem: Project = {
      title: "",
      link: "",
      from: "",
      to: "",
      current: false,
      summary: "",
    };

    setData([...data, newItem]);

    /* Auto open new */
    setOpenIndexes([
      ...openIndexes,
      data.length,
    ]);
  };

  /* ================= DELETE ================= */

  const deleteProject = (
    index: number
  ) => {
    const updated = data.filter(
      (_, i) => i !== index
    );

    setData(updated);

    setOpenIndexes(
      openIndexes.filter((i) => i !== index)
    );
  };

  /* ================= CHANGE ================= */

  const handleChange = <
    K extends keyof Project
  >(
    index: number,
    field: K,
    value: Project[K]
  ) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  return (
    <div className="experience-section">

      {/* ADD BUTTON */}
      <button
        className="add-work-btn"
        onClick={addProject}
      >
        Add project
      </button>

      {/* LIST */}
      {data.map((proj, index) => {

        const isOpen =
          openIndexes.includes(index);

        return (
          <div
            key={index}
            className="experience-item"
          >

            {/* HEADER */}
            <div className="experience-header">

              {/* DELETE */}
              <button
                className="delete-btn"
                onClick={() =>
                  deleteProject(index)
                }
              >
                <FaTrash />
              </button>

              {/* TITLE */}
              <span
                className="exp-title"
                onClick={() =>
                  toggleOpen(index)
                }
              >
                {proj.title ||
                  "New Project"}
              </span>

              {/* ARROW */}
              <span
                className="arrow"
                onClick={() =>
                  toggleOpen(index)
                }
              >
                {isOpen ? (
                  <FaAngleUp />
                ) : (
                  <FaAngleDown />
                )}
              </span>

            </div>

            {/* FORM */}
            {isOpen && (
              <div className="experience-form">

                {/* TITLE */}
                <label>
                  <FaBriefcase
                    style={{
                      color: "#6d28d9",
                    }}
                  />
                  Title
                </label>

                <input
                  value={proj.title}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                />

                {/* LINK */}
                <label>
                  <FaLink
                    style={{
                      color: "#2563eb",
                    }}
                  />
                  Project Link
                </label>

                <input
                  value={proj.link}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "link",
                      e.target.value
                    )
                  }
                />



                {/* SUMMARY */}
                <label>
                  <FaAlignLeft style={{ color: "#ec4899" }} />
                  Summary
                </label>

                <EditorProvider>
                  <Editor
                    value={proj.summary}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "summary",
                        e.target.value
                      )
                    }
                  >
                    <Toolbar>
                      <BtnBold />
                      <BtnItalic />
                      <BtnUnderline />
                      <BtnBulletList />
                      <BtnNumberedList />
                      <BtnLink />
                    </Toolbar>
                  </Editor>
                </EditorProvider>

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}

export default ProjectsForm;

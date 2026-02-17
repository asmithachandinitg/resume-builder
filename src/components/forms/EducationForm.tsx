import { useState } from "react";
import type { ResumeData } from "../../types/resume";

import {
  FaCalendarAlt,
  FaCalendarCheck,
  FaAlignLeft,
  FaTrash,
  FaAngleDown,
  FaAngleUp,
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

import { FaSchool } from "react-icons/fa6";
import { HiAcademicCap } from "react-icons/hi2";

type Education =
  ResumeData["education"][number];

interface Props {
  data: Education[];
  setData: (val: Education[]) => void;
}

function EducationForm({
  data,
  setData,
}: Props) {

  const [openIndexes, setOpenIndexes] =
    useState<number[]>([]);

  /* TOGGLE */
  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  /* ADD */
  const addEducation = () => {
    const newItem: Education = {
      school: "",
      degree: "",
      from: "",
      to: "",
      current: false,
      summary: "",
    };

    setData([...data, newItem]);

    setOpenIndexes([
      ...openIndexes,
      data.length,
    ]);
  };

  /* DELETE */
  const deleteEducation = (
    index: number
  ) => {
    setData(
      data.filter((_, i) => i !== index)
    );
  };

  /* CHANGE */
  const handleChange = <
    K extends keyof Education
  >(
    index: number,
    field: K,
    value: Education[K]
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
        onClick={addEducation}
      >
        Add education
      </button>

      {data.map((edu, index) => {

        const isOpen =
          openIndexes.includes(index);

        return (
          <div key={index}>

            {/* HEADER */}
            <div className="experience-header">

              <button
                className="delete-btn"
                onClick={() =>
                  deleteEducation(index)
                }
              >
                <FaTrash />
              </button>

              <span
                className="exp-title"
                onClick={() =>
                  toggleOpen(index)
                }
              >
                {edu.degree ||
                  "New Education"}
              </span>

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

                {/* SCHOOL */}
                <label>
                  <FaSchool
                    style={{
                      color: "#9225eb",
                    }}
                  />
                  School
                </label>

                <input
                  value={edu.school}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "school",
                      e.target.value
                    )
                  }
                />

                {/* DEGREE */}
                <label>
                  <HiAcademicCap />
                  Degree
                </label>

                <input
                  value={edu.degree}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "degree",
                      e.target.value
                    )
                  }
                />

                {/* FROM */}
                <label>
                  <FaCalendarAlt
                    style={{
                      color: "#2563eb",
                    }}
                  />
                  From
                </label>

                <input
                  type="date"
                  value={edu.from}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "from",
                      e.target.value
                    )
                  }
                />

                {/* TO + CURRENT */}
                <div className="to-group">

                  {/* HEADER ROW */}
                  <div className="to-header">

                    <label>
                      <FaCalendarCheck
                        style={{
                          color: "#2563eb",
                        }}
                      />
                      To
                    </label>

                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={edu.current}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "current",
                            e.target.checked
                          )
                        }
                      />
                      Current
                    </label>

                  </div>

                  {/* DATE INPUT */}
                  <input
                    type="date"
                    disabled={edu.current}
                    value={edu.to}
                    onChange={(e) =>
                      handleChange(
                        index,
                        "to",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* SUMMARY */}
            <label>
  <FaAlignLeft style={{ color: "#ec4899" }} />
  Summary
</label>

<EditorProvider>
  <Editor
    value={edu.summary}
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

export default EducationForm;

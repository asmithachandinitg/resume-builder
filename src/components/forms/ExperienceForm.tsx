import { useState } from "react";
import type { ResumeData } from "../../types/resume";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCalendarCheck,
  FaTrash,
  FaAlignLeft,
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


type Experience =
  ResumeData["experience"][number];

interface Props {
  data: Experience[];
  setData: (val: Experience[]) => void;
}

function ExperienceForm({
  data,
  setData,
}: Props) {

  /* ================= OPEN TRACK ================= */

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

  /* ADD WORK */
  const addWork = () => {
    const newItem: Experience = {
      title: "",
      CurrentCity: "",
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

  /* DELETE */
  const deleteWork = (index: number) => {
    const updated = data.filter(
      (_, i) => i !== index
    );

    setData(updated);

    setOpenIndexes(
      openIndexes.filter((i) => i !== index)
    );
  };

  /* FIELD CHANGE */
  const handleChange = <
    K extends keyof Experience
  >(
    index: number,
    field: K,
    value: Experience[K]
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
        onClick={addWork}
      >
        Add work
      </button>

      {/* LIST */}
      {data.map((exp, index) => {

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
                  deleteWork(index)
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
                {exp.title ||
                  "New Experience"}
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
                  value={exp.title}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "title",
                      e.target.value
                    )
                  }
                />

                {/* LOCATION */}
                <label>
                  <FaMapMarkerAlt
                    style={{
                      color: "#059669",
                    }}
                  />
                  Current city
                </label>

                <input
                  value={exp.CurrentCity}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "CurrentCity",
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
                  value={exp.from}
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
                        checked={exp.current}
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
                    disabled={exp.current}
                    value={exp.to}
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
    value={exp.summary}
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

export default ExperienceForm;

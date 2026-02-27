import { useState } from "react";
import "./ExperienceForm.css";

import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCalendarCheck,
  FaTrash,
  FaAlignLeft,
  FaAngleDown,
  FaAngleUp,
  FaStickyNote,
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

export interface InternshipEntry {
  company: string;
  title: string;
  CurrentCity: string;
  from: string;
  to: string;
  current: boolean;
  summary: string;
  subtext: string;
}

interface Props {
  data: InternshipEntry[];
  setData: (val: InternshipEntry[]) => void;
}

function InternshipForm({ data, setData }: Props) {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);

  /* TOGGLE */
  const toggleOpen = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  /* ADD */
  const addInternship = () => {
    const newItem: InternshipEntry = {
      company: "",
      title: "",
      CurrentCity: "",
      from: "",
      to: "",
      current: false,
      summary: "",
      subtext: "",
    };
    setData([...data, newItem]);
    setOpenIndexes([...openIndexes, data.length]);
  };

  /* DELETE */
  const deleteInternship = (index: number) => {
    setData(data.filter((_, i) => i !== index));
    setOpenIndexes(openIndexes.filter((i) => i !== index));
  };

  /* CHANGE */
  const handleChange = <K extends keyof InternshipEntry>(
    index: number,
    field: K,
    value: InternshipEntry[K]
  ) => {
    const updated = [...data];
    updated[index] = { ...updated[index], [field]: value };
    setData(updated);
  };

  return (
    <div className="experience-section">

      {/* ADD BUTTON */}
      <button className="add-work-btn" onClick={addInternship}>
        Add internship
      </button>

      {data.map((intern, index) => {
        const isOpen = openIndexes.includes(index);

        return (
          <div key={index} className="experience-item">

            {/* HEADER */}
            <div className="experience-header">
              <button
                className="delete-btn"
                onClick={() => deleteInternship(index)}
              >
                <FaTrash />
              </button>

              <span
                className="exp-title"
                onClick={() => toggleOpen(index)}
              >
                {intern.company || intern.title || "New Internship"}
              </span>

              <span className="arrow" onClick={() => toggleOpen(index)}>
                {isOpen ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {/* FORM */}
            {isOpen && (
              <div className="experience-form">

                {/* COMPANY */}
                <label>
                  <FaBuilding style={{ color: "#0891b2" }} />
                  Company Name
                </label>
                <input
                  value={intern.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                />

                {/* TITLE / ROLE */}
                <label>
                  <FaBriefcase style={{ color: "#6d28d9" }} />
                  Role / Position
                </label>
                <input
                  value={intern.title}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                />

                {/* LOCATION */}
                <label>
                  <FaMapMarkerAlt style={{ color: "#059669" }} />
                  Location
                </label>
                <input
                  value={intern.CurrentCity}
                  onChange={(e) => handleChange(index, "CurrentCity", e.target.value)}
                />

                {/* FROM */}
                <label>
                  <FaCalendarAlt style={{ color: "#2563eb" }} />
                  From
                </label>
                <input
                  type="date"
                  value={intern.from}
                  onChange={(e) => handleChange(index, "from", e.target.value)}
                />

                {/* TO + CURRENT */}
                <div className="to-group">
                  <div className="to-header">
                    <label>
                      <FaCalendarCheck style={{ color: "#2563eb" }} />
                      To
                    </label>
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={intern.current}
                        onChange={(e) => handleChange(index, "current", e.target.checked)}
                      />
                      Current
                    </label>
                  </div>
                  <input
                    type="date"
                    disabled={intern.current}
                    value={intern.to}
                    onChange={(e) => handleChange(index, "to", e.target.value)}
                  />
                </div>

                {/* SUBTEXT */}
                <label>
                  <FaStickyNote style={{ color: "#f59e0b" }} />
                  Subtext{" "}
                  <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.85em" }}>
                    (optional)
                  </span>
                </label>
                <input
                  placeholder="e.g. Summer Internship · Remote"
                  value={intern.subtext}
                  onChange={(e) => handleChange(index, "subtext", e.target.value)}
                />

                {/* SUMMARY */}
                <label>
                  <FaAlignLeft style={{ color: "#ec4899" }} />
                  Summary
                </label>
                <EditorProvider>
                  <Editor
                    value={intern.summary}
                    onChange={(e) => handleChange(index, "summary", e.target.value)}
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

export default InternshipForm;

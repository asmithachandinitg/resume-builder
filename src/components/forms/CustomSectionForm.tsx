import { useState } from "react";
import {
  FaTrash,
  FaAngleDown,
  FaAngleUp,
  FaAlignLeft,
  FaPlus,
  FaHeading,
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

export interface CustomSection {
  title: string;
  items: CustomSectionItem[];
}

export interface CustomSectionItem {
  heading: string;
  subtext: string;
  summary: string;
}

interface Props {
  data: CustomSection[];
  setData: (val: CustomSection[]) => void;
}

function CustomSectionForm({ data, setData }: Props) {
  const [openSections, setOpenSections] = useState<number[]>([]);
  const [openItems, setOpenItems] = useState<Record<number, number[]>>({});

  /* ===== SECTION TOGGLE ===== */
  const toggleSection = (si: number) => {
    setOpenSections((prev) =>
      prev.includes(si) ? prev.filter((i) => i !== si) : [...prev, si]
    );
  };

  /* ===== ITEM TOGGLE ===== */
  const toggleItem = (si: number, ii: number) => {
    setOpenItems((prev) => {
      const cur = prev[si] || [];
      return {
        ...prev,
        [si]: cur.includes(ii)
          ? cur.filter((i) => i !== ii)
          : [...cur, ii],
      };
    });
  };

  /* ===== ADD SECTION ===== */
  const addSection = () => {
    const newSection: CustomSection = {
      title: "",
      items: [],
    };
    setData([...data, newSection]);
    setOpenSections([...openSections, data.length]);
  };

  /* ===== DELETE SECTION ===== */
  const deleteSection = (si: number) => {
    setData(data.filter((_, i) => i !== si));
  };

  /* ===== SECTION TITLE CHANGE ===== */
  const handleSectionTitle = (si: number, val: string) => {
    const updated = [...data];
    updated[si] = { ...updated[si], title: val };
    setData(updated);
  };

  /* ===== ADD ITEM ===== */
  const addItem = (si: number) => {
    const updated = [...data];
    const newItem: CustomSectionItem = { heading: "", subtext: "", summary: "" };
    updated[si] = {
      ...updated[si],
      items: [...updated[si].items, newItem],
    };
    setData(updated);
    const ii = updated[si].items.length - 1;
    setOpenItems((prev) => ({
      ...prev,
      [si]: [...(prev[si] || []), ii],
    }));
  };

  /* ===== DELETE ITEM ===== */
  const deleteItem = (si: number, ii: number) => {
    const updated = [...data];
    updated[si] = {
      ...updated[si],
      items: updated[si].items.filter((_, i) => i !== ii),
    };
    setData(updated);
  };

  /* ===== ITEM CHANGE ===== */
  const handleItemChange = (
    si: number,
    ii: number,
    field: keyof CustomSectionItem,
    val: string
  ) => {
    const updated = [...data];
    const items = [...updated[si].items];
    items[ii] = { ...items[ii], [field]: val };
    updated[si] = { ...updated[si], items };
    setData(updated);
  };

  return (
    <div className="experience-section">

      {/* ADD SECTION BUTTON */}
      <button className="add-work-btn" onClick={addSection}>
        + Add custom section
      </button>

      {data.map((section, si) => {
        const isSectionOpen = openSections.includes(si);

        return (
          <div key={si} style={{ marginBottom: "12px" }}>

            {/* SECTION HEADER */}
            <div className="experience-header">
              <button
                className="delete-btn"
                onClick={() => deleteSection(si)}
              >
                <FaTrash />
              </button>

              <span
                className="exp-title"
                onClick={() => toggleSection(si)}
              >
                {section.title || "New Section"}
              </span>

              <span className="arrow" onClick={() => toggleSection(si)}>
                {isSectionOpen ? <FaAngleUp /> : <FaAngleDown />}
              </span>
            </div>

            {/* SECTION CONTENT */}
            {isSectionOpen && (
              <div className="experience-form">

                {/* SECTION TITLE INPUT */}
                <label>
                  <FaHeading style={{ color: "#6d28d9" }} />
                  Section Title
                </label>
                <input
                  placeholder="e.g. Certifications, Awards, Volunteering..."
                  value={section.title}
                  onChange={(e) => handleSectionTitle(si, e.target.value)}
                />

                {/* ITEMS */}
                {section.items.map((item, ii) => {
                  const isItemOpen = (openItems[si] || []).includes(ii);

                  return (
                    <div
                      key={ii}
                      style={{
                        marginTop: "10px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      {/* ITEM HEADER */}
                      <div className="experience-header" style={{ background: "#f9fafb" }}>
                        <button
                          className="delete-btn"
                          onClick={() => deleteItem(si, ii)}
                        >
                          <FaTrash />
                        </button>

                        <span
                          className="exp-title"
                          onClick={() => toggleItem(si, ii)}
                        >
                          {item.heading || "New Entry"}
                        </span>

                        <span
                          className="arrow"
                          onClick={() => toggleItem(si, ii)}
                        >
                          {isItemOpen ? <FaAngleUp /> : <FaAngleDown />}
                        </span>
                      </div>

                      {/* ITEM FORM */}
                      {isItemOpen && (
                        <div className="experience-form">

                          <label>
                            <FaHeading style={{ color: "#0891b2" }} />
                            Heading
                          </label>
                          <input
                            placeholder="e.g. AWS Certified Developer"
                            value={item.heading}
                            onChange={(e) =>
                              handleItemChange(si, ii, "heading", e.target.value)
                            }
                          />

                          <label>
                            <FaAlignLeft style={{ color: "#f59e0b" }} />
                            Subtext <span style={{ color: "#9ca3af", fontWeight: 400, fontSize: "0.85em" }}>(optional)</span>
                          </label>
                          <input
                            placeholder="e.g. 2024 · Amazon Web Services"
                            value={item.subtext}
                            onChange={(e) =>
                              handleItemChange(si, ii, "subtext", e.target.value)
                            }
                          />

                          <label>
                            <FaAlignLeft style={{ color: "#ec4899" }} />
                            Details
                          </label>
                          <EditorProvider>
                            <Editor
                              value={item.summary}
                              onChange={(e) =>
                                handleItemChange(si, ii, "summary", e.target.value)
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

                {/* ADD ENTRY */}
                <button
                  className="add-work-btn"
                  style={{ marginTop: "10px" }}
                  onClick={() => addItem(si)}
                >
                  <FaPlus style={{ marginRight: 4 }} />
                  Add entry
                </button>

              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}

export default CustomSectionForm;

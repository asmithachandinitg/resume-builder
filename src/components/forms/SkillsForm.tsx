import { useState } from "react";
import type { ResumeData } from "../../types/resume";

import {
  FaLaptopCode,
  FaUserFriends,
  FaGlobe,
  FaHeart,
} from "react-icons/fa";

type Skills = ResumeData["skills"];

type SkillArrayKey =
  | "technical"
  | "soft"
  | "languages"
  | "interests";

interface Props {
  data: Skills;
  setData: (val: Skills) => void;
}

function SkillsForm({ data, setData }: Props) {

  /* ================= INPUT STATE ================= */

const [inputs, setInputs] = useState<
  Record<
    "technical" |
    "soft" |
    "languages" |
    "interests",
    string
  >
>({
  technical: "",
  soft: "",
  languages: "",
  interests: "",
});


  /* ================= ADD SKILL ================= */

const addSkill = (type: SkillArrayKey) => {

  if (!inputs[type]) return;

  setData({
    ...data,
    [type]: [
      ...data[type],
      inputs[type],
    ],
  });

  setInputs({
    ...inputs,
    [type]: "",
  });
};

  /* ================= REMOVE SKILL ================= */

  const removeSkill = (
    type: keyof Skills,
    index: number
  ) => {

    const updated = [
      ...(data[type] as string[]),
    ];

    updated.splice(index, 1);

    setData({
      ...data,
      [type]: updated,
    });
  };

  /* ================= TOGGLE SHOW ================= */

  const toggleShow = (
    key:
      | "showTechnical"
      | "showSoft"
      | "showLanguages"
      | "showInterests"
  ) => {

    setData({
      ...data,
      [key]: !data[key],
    });
  };

  /* ================= RENDER BLOCK ================= */

  const renderBlock = (
    label: string,
    type:
      | "technical"
      | "soft"
      | "languages"
      | "interests",
    showKey:
      | "showTechnical"
      | "showSoft"
      | "showLanguages"
      | "showInterests",
    icon: React.ReactNode,
    color: string
  ) => (

    <div className="skills-block">

      {/* HEADER */}
      <h4 className="skills-title">
        <span
          className="skills-icon"
          style={{ color }}
        >
          {icon}
        </span>

        {label}
      </h4>

      {/* ================= SWITCH TOGGLE ================= */}

      <div className="toggle-row">

        <span>
          Display section on CV
        </span>

        <button
          className={`toggle-switch ${
            data[showKey] ? "on" : "off"
          }`}
          onClick={() =>
            toggleShow(showKey)
          }
        >
          <div className="toggle-knob" />
        </button>

      </div>

      {/* INPUT + ADD */}

      <div className="skills-input">

        <input
          value={inputs[type]}
          placeholder={`Add ${label}`}
          onChange={(e) =>
            setInputs({
              ...inputs,
              [type]: e.target.value,
            })
          }
        />

        <button
          onClick={() =>
            addSkill(type)
          }
        >
          Add
        </button>

      </div>

      {/* CHIPS */}

      <div className="skills-chips">

        {(data[type] as string[]).map(
          (skill, i) => (
            <span
              key={i}
              className="chip"
            >
              {skill}

              <b
                onClick={() =>
                  removeSkill(
                    type,
                    i
                  )
                }
              >
                ×
              </b>
            </span>
          )
        )}

      </div>

    </div>
  );

  /* ================= UI ================= */

  return (
    <div className="skills-section">

      {renderBlock(
        "Technical Skills",
        "technical",
        "showTechnical",
        <FaLaptopCode />,
        "#6d28d9"
      )}

      {renderBlock(
        "Soft Skills",
        "soft",
        "showSoft",
        <FaUserFriends />,
        "#2563eb"
      )}

      {renderBlock(
        "Languages",
        "languages",
        "showLanguages",
        <FaGlobe />,
        "#059669"
      )}

      {renderBlock(
        "Interests",
        "interests",
        "showInterests",
        <FaHeart />,
        "#ec4899"
      )}

    </div>
  );
}

export default SkillsForm;

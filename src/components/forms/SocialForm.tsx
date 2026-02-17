import type { ResumeData } from "../../types/resume";

import { GrLinkedin } from "react-icons/gr";
import { FaTwitterSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import { PiGlobeBold } from "react-icons/pi";

type Social = ResumeData["social"];

interface Props {
  data: Social;
  setData: (val: Social) => void;
}

function SocialForm({ data, setData }: Props) {

  /* ================= CHANGE HANDLER ================= */

  const handleChange = (
    field: keyof Social,
    value: string | boolean
  ) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  /* ================= TOGGLE ================= */

  const toggleShow = () => {
    setData({
      ...data,
      show: !data.show,
    });
  };

  /* ================= UI ================= */

  return (
    <div className="social-section">

      {/* ================= SWITCH TOGGLE ================= */}

      <div className="toggle-row">

        <span>
          Display section on CV
        </span>

        <button
          className={`toggle-switch ${
            data.show ? "on" : "off"
          }`}
          onClick={toggleShow}
        >
          <div className="toggle-knob" />
        </button>

      </div>

      {/* ================= LINKEDIN ================= */}

      <div className="social-field">
        <label>
          <GrLinkedin
            style={{ color: "#0A66C2" }}
          />
        LinkedIn
        </label>

        <input
          value={data.linkedin}
          onChange={(e) =>
            handleChange(
              "linkedin",
              e.target.value
            )
          }
        />
      </div>

      {/* ================= TWITTER ================= */}

      <div className="social-field">
        <label>
          <FaTwitterSquare
            style={{ color: "#1DA1F2" }}
          />
          Twitter
        </label>

        <input
          value={data.twitter}
          onChange={(e) =>
            handleChange(
              "twitter",
              e.target.value
            )
          }
        />
      </div>

      {/* ================= GITHUB ================= */}

      <div className="social-field">
        <label>
          <FaGithub />
          GitHub
        </label>

        <input
          value={data.github}
          onChange={(e) =>
            handleChange(
              "github",
              e.target.value
            )
          }
        />
      </div>

      {/* ================= WEBSITE ================= */}

      <div className="social-field">
        <label>
          <PiGlobeBold />
          Website
        </label>

        <input
          value={data.website}
          onChange={(e) =>
            handleChange(
              "website",
              e.target.value
            )
          }
        />
      </div>

    </div>
  );
}

export default SocialForm;

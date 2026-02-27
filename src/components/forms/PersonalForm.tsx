import { useState } from "react";
import type { PersonalData } from "../../types/resume";

import { ImFilePicture } from "react-icons/im";
import { FcBriefcase } from "react-icons/fc";
import { IoPersonSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { HiLocationMarker } from "react-icons/hi";
import { FaMobileRetro } from "react-icons/fa6";
import { GiFlowerStar } from "react-icons/gi";
import { FaUserTie } from "react-icons/fa";
import "./PersonalForm.css";

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

/* CROP COMPONENT */
import PhotoCropper from "../ui/PhotoCropper";

type Props = {
  data: PersonalData;
  setData: (val: PersonalData) => void;
};

function PersonalForm({ data, setData }: Props) {
  /* ================= CROP STATES ================= */

  const [showCrop, setShowCrop] =
    useState(false);

  const [tempImage, setTempImage] =
    useState("");

  /* ================= PHOTO UPLOAD ================= */

  const handlePhotoUpload = () => {
    const input =
      document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = (e: any) => {
      const file =
        e.target.files?.[0];
      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = () => {
        setTempImage(
          reader.result as string
        );
        setShowCrop(true);
      };

      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleCropSave = (
    cropped: string
  ) => {
    setData({
      ...data,
      photo: cropped,
    });
    setShowCrop(false);
  };

  const clearPhoto = () => {
    setData({
      ...data,
      photo: "",
    });
  };

  /* ================= INPUT CHANGE ================= */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setData({
      ...data,
      [e.target.name]:
        e.target.value,
    });
  };

  /* ================= EXPERIENCE LEVEL ================= */

  const updateExperienceLevel = (
    level: "fresher" | "experienced"
  ) => {
    setData({
      ...data,
      experienceLevel: level,
    });
  };

  /* ================= UI ================= */

  return (
    <div className="personal-section">

      {/* ================= PHOTO ================= */}

      <div className="photo-upload">

        <label className="photo-label">
          <ImFilePicture /> Profile picture
        </label>

        <div className="photo-actions">

          <button
            className="upload-photo-btn"
            onClick={handlePhotoUpload}
          >
            Upload profile image
          </button>

          <button
            className="clear-photo-btn"
            onClick={clearPhoto}
          >
            Clear
          </button>

        </div>
      </div>

      {/* ================= JOB ================= */}

      <label>
        <FcBriefcase />
        Job Title / Current Position
      </label>

      <input
        name="jobTitle"
        value={data.jobTitle}
        onChange={handleChange}
      />

      {/* ================= NAME ================= */}

      <div className="row">

        <div>
          <label>
            <IoPersonSharp />
            First name
          </label>

          <input
            name="firstName"
            value={data.firstName}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            <IoPersonSharp />
            Last name
          </label>

          <input
            name="lastName"
            value={data.lastName}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* ================= EMAIL ================= */}

      <label>
        <MdEmail style={{ color: "#1DA1F2" }} />
        Email
      </label>

      <input
        name="email"
        value={data.email}
        onChange={handleChange}
      />

      {/* ================= LOCATION / PHONE ================= */}

      <div className="row">

        <div>
          <label>
            <HiLocationMarker
              style={{ color: "#f21d39ff" }}
            />
            Current City
          </label>

          <input
            name="CurrentCity"
            value={data.CurrentCity}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            <FaMobileRetro
              style={{ color: "#321df2ff" }}
            />
            Phone number
          </label>

          <input
            name="phone"
            value={data.phone}
            onChange={handleChange}
          />
        </div>

      </div>

      {/* ================= EXPERIENCE LEVEL ================= */}

      <label> <FaUserTie
          style={{ color: "#6d28d9" }}
        /> Experience Level</label>

      <div className="exp-level">

        <label>
          <input
            type="radio"
            checked={
              data.experienceLevel ===
              "fresher"
            }
            onChange={() =>
              updateExperienceLevel(
                "fresher"
              )
            }
          />
          Fresher
        </label>

        <label>
          <input
            type="radio"
            checked={
              data.experienceLevel ===
              "experienced"
            }
            onChange={() =>
              updateExperienceLevel(
                "experienced"
              )
            }
          />
          Experienced
        </label>

      </div>

      {/* YEARS / MONTHS */}

      {data.experienceLevel ===
        "experienced" && (
        <div className="exp-duration">

          <select
            value={
              data.experienceYears || 0
            }
            onChange={(e) =>
              setData({
                ...data,
                experienceYears:
                  Number(
                    e.target.value
                  ),
              })
            }
          >
            {[...Array(21)].map(
              (_, i) => (
                <option
                  key={i}
                  value={i}
                >
                  {i} Years
                </option>
              )
            )}
          </select>

          <select
            value={
              data.experienceMonths || 0
            }
            onChange={(e) =>
              setData({
                ...data,
                experienceMonths:
                  Number(
                    e.target.value
                  ),
              })
            }
          >
            {[...Array(12)].map(
              (_, i) => (
                <option
                  key={i}
                  value={i}
                >
                  {i} Months
                </option>
              )
            )}
          </select>

        </div>
      )}

      {/* ================= ABOUT ================= */}

      <label>
        <GiFlowerStar
          style={{ color: "#ebee4fff" }}
        />
        Profile summary
      </label>

      <EditorProvider>
        <Editor
          value={data.about}
          onChange={(e) =>
            setData({
              ...data,
              about: e.target.value,
            })
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

      {/* ================= CROP MODAL ================= */}

      {showCrop && (
        <PhotoCropper
          image={tempImage}
          onSave={handleCropSave}
          onClose={() =>
            setShowCrop(false)
          }
        />
      )}

    </div>
  );
}

export default PersonalForm;

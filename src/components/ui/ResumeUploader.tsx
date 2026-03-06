// src/components/ui/ResumeUploader.tsx
//
// Lets user upload a PDF resume and auto-fills all form fields.
// Uses pdfjs-dist to extract text, then resumeParser.ts to map it.

import { useState, useRef } from "react";
import type { ResumeData } from "../../types/resume";
import { parseResumeText } from "../../utils/resumeParser";
import "./ResumeUploader.css";

// pdfjs-dist setup
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface Props {
  onParsed: (data: Partial<ResumeData>) => void;
}

type Status = "idle" | "reading" | "parsing" | "done" | "error";

export default function ResumeUploader({ onParsed }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [fileName, setFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── EXTRACT TEXT FROM PDF ────────────────────────────────

  async function extractTextFromPDF(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  }

  // ── PROCESS FILE ─────────────────────────────────────────

  async function processFile(file: File) {
    if (!file || file.type !== "application/pdf") {
      setErrorMsg("Please upload a PDF file.");
      setStatus("error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File too large. Max 5MB.");
      setStatus("error");
      return;
    }

    setFileName(file.name);
    setErrorMsg("");

    try {
      setStatus("reading");
      const rawText = await extractTextFromPDF(file);

      setStatus("parsing");
      const parsed = parseResumeText(rawText);

      setStatus("done");
      onParsed(parsed);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not read this PDF. Try a different file.");
      setStatus("error");
    }
  }

  // ── DRAG & DROP ──────────────────────────────────────────

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleReset() {
    setStatus("idle");
    setFileName("");
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  }

  // ── RENDER ───────────────────────────────────────────────

  return (
    <div className="uploader-wrapper">

      <div className="uploader-header">
        <h3>Upload Existing Resume</h3>
        <p>Upload a PDF and we'll auto-fill your details.</p>
      </div>

      {/* DROP ZONE */}
      {status === "idle" || status === "error" ? (
        <div
          className={`drop-zone ${dragging ? "dragging" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
        >
          <div className="drop-icon">📄</div>
          <p className="drop-text">
            <strong>Click to upload</strong> or drag & drop
          </p>
          <p className="drop-hint">PDF only · Max 5MB</p>

          {status === "error" && (
            <p className="upload-error">{errorMsg}</p>
          )}

          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleFileInput}
          />
        </div>
      ) : null}

      {/* LOADING */}
      {(status === "reading" || status === "parsing") && (
        <div className="upload-loading">
          <div className="upload-spinner" />
          <p>{status === "reading" ? "Reading PDF..." : "Extracting your details..."}</p>
        </div>
      )}

      {/* SUCCESS */}
      {status === "done" && (
        <div className="upload-success">
          <span className="success-icon">✅</span>
          <div>
            <p className="success-title">Resume imported!</p>
            <p className="success-file">{fileName}</p>
            <p className="success-note">
              Your fields have been filled. Review and edit anything that looks off.
            </p>
          </div>
          <button className="upload-reset-btn" onClick={handleReset}>
            Upload Different
          </button>
        </div>
      )}

    </div>
  );
}

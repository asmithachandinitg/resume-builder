import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* Resume Images */
const resumes = [
  "/resume.jpg",
  "/resume1.png",
  "/resume2.png",
];

function Home() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  /* AUTO ROTATE */
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % resumes.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">

      {/* ===== PAGE CENTER WRAPPER ===== */}
      <div className="home-container">

        {/* ===== NAVBAR ===== */}
        <nav className="navbar">
          <h1 className="logo">BuildMyCV</h1>

          <button
            className="create-btn"
            onClick={() => navigate("/builder")}
          >
            Create CV
          </button>
        </nav>

        {/* ===== HERO ===== */}
        <section className="hero">

          <h2>
            Create your <span>CV for free</span> <br />
            and own your data.
          </h2>

          <p>
            BuildMyCV is an open-sourced multilingual and privacy-friendly resume builder that helps you create your CV and download it in PDF in just a few minutes.
          </p>

          <button
            className="get-started"
            onClick={() => navigate("/builder")}
          >
            Get Started →
          </button>

          {/* ===== ROTATING RESUMES ===== */}
          <div className="carousel">
            {resumes.map((src, i) => {
              const position =
                (i - index + resumes.length) % resumes.length;

              return (
                <img
                  key={i}
                  src={src}
                  alt="resume template"
                  className={`card position-${position}`}
                />
              );
            })}
          </div>

        </section>
      </div>
    </div>
  );
}

export default Home;

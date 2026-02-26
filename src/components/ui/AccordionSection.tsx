import { useRef, useEffect } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import "./AccordionSection.css";

type Props = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
};

function AccordionSection({
  title,
  children,
  isOpen,
  onToggle,
}: Props) {
  const sectionRef =
    useRef<HTMLDivElement>(null);

  /* AUTO SCROLL */
  useEffect(() => {
    if (isOpen && sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isOpen]);

  return (
    <div
      ref={sectionRef}
      className="accordion-section"
    >
      {/* HEADER */}
      <div
        className="accordion-header"
        onClick={onToggle}
      >
        <h3>{title}</h3>

        {/* ICON TOGGLE */}
        <span className="accordion-icon">
          {isOpen ? (
            <FaAngleUp />
          ) : (
            <FaAngleDown />
          )}
        </span>
      </div>

      {/* BODY */}
      {isOpen && (
        <div className="accordion-body">
          {children}
        </div>
      )}
    </div>
  );
}

export default AccordionSection;

import React, { useState } from "react";
import "./mobilefooter.css";

interface Props {
  title: string;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<Props> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button className="collapsible-btn" onClick={() => setIsOpen(!isOpen)}>
        {title}
        <span className={isOpen ? "triangle-down" : "triangle-right"} />
      </button>
      {isOpen && <ul className="menu">{children}</ul>}
    </div>
  );
};

export default CollapsibleSection;

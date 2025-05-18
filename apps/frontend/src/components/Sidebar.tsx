
import React, { useState } from "react";
import { menu } from "./menuConfig";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const toggleSection = (label: string) => {
    setOpenSection(prev => (prev === label ? null : label));
    setOpenSub(null);
  };

  const toggleSub = (label: string) => {
    setOpenSub(prev => (prev === label ? null : label));
  };

  const isActivePath = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div
      className={`transition-all duration-200 ${visible ? "w-64" : "w-16"} bg-[#2196F3] text-white overflow-x-hidden h-full font-sans`}
      style={{ height: "calc(100vh - 48px)" }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => {
        setVisible(false);
        setOpenSection(null);
        setOpenSub(null);
      }}
    >
      <ul className="p-2 text-sm text-gray-100">
        {/* Home Page in cima */}
        <li>
          <Link
            to="/dashboard"
            className={`block py-2 px-2 font-bold flex items-center gap-2 hover:bg-blue-800 rounded ${
              isActivePath("/dashboard") ? "bg-blue-900" : ""
            }`}
          >
            <span>🏠</span>
            {visible && <span>Home Page</span>}
          </Link>
        </li>

        {/* Menu dinamico */}
        {Array.isArray(menu) &&
          menu.map((section, idx) => (
            <li key={idx}>
              <button
                onClick={() => toggleSection(section.label)}
                className={`w-full text-left font-bold py-2 flex items-center justify-between hover:bg-blue-700 px-2 rounded ${
                  openSection === section.label ? "bg-blue-800" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{section.icon}</span>
                  {visible && <span>{section.label}</span>}
                </div>
                {visible && (
                  <span
                    className={`transition-transform duration-300 ${
                      openSection === section.label ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    ▶
                  </span>
                )}
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openSection === section.label && visible ? "max-h-[1000px]" : "max-h-0"
                }`}
              >
                <ul className="pl-6 text-sm">
                  {section.children?.map((child, i) => {
                    if (typeof child === "string") {
                      return (
                        <li key={i} className="py-1 px-2 text-gray-400 italic">
                          {child}
                        </li>
                      );
                    }

                    if ("to" in child) {
                      return (
                        <li key={i}>
                          <Link
                            to={child.to}
                            className={`block py-1 px-2 hover:bg-blue-800 rounded ${
                              isActivePath(child.to) ? "bg-blue-900" : ""
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    }

                    if ("sub" in child) {
                      const subActive = child.sub.some((s) => isActivePath(s.to));
                      return (
                        <li key={i}>
                          <button
                            onClick={() => toggleSub(child.label)}
                            className={`font-semibold w-full text-left px-2 py-1 hover:bg-blue-800 rounded flex justify-between ${
                              subActive ? "bg-blue-800" : ""
                            }`}
                          >
                            <span>{child.label}</span>
                            <span
                              className={`transition-transform duration-300 ${
                                openSub === child.label ? "rotate-90" : "rotate-0"
                              }`}
                            >
                              ▶
                            </span>
                          </button>
                          <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                              openSub === child.label ? "max-h-[500px]" : "max-h-0"
                            }`}
                          >
                            <ul className="pl-4 text-xs">
                              {child.sub.map((sub, j) => (
                                <li key={j}>
                                  <Link
                                    to={sub.to}
                                    className={`block py-0.5 px-2 hover:bg-blue-900 rounded ${
                                      isActivePath(sub.to) ? "bg-blue-950" : ""
                                    }`}
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      );
                    }

                    return null;
                  })}
                </ul>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logo } from "../assets";
// import { pickloadicon, pickloadtitle } from "../assets";


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-purple-800 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-between px-4  md:py-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Pickload Icon" className="w-24" />
          {/* <img src={pickloadtitle} alt="Pickload Title" className="h-5 md:h-6" /> */}
        </Link>

        {/* Hamburger Button (Mobile) */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
        >
          <span
            className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[7px]" : ""
              }`}
          ></span>
          <span
            className={`block w-6 h-[2px] bg-white rounded my-[4px] transition-all duration-300 ${isOpen ? "opacity-0" : ""
              }`}
          ></span>
          <span
            className={`block w-6 h-[2px] bg-white rounded transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
          ></span>
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-6">
          <li>
            <Link
              to="https://www.youtube.com/@pickloadlogistics7714"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Learn
            </Link>
          </li>
          <li>
            <Link
              to="https://pickload.ng/faqs"
              target="_blank"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              FAQs
            </Link>
          </li>
          <li>
            <Link
              to=""
              target="_blank"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Refer a Friend
            </Link>
          </li>
          <li>
            <Link to="https://pickload.ng/downloadapp">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Sign Up Now
              </button>
            </Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-inner">
          <ul className="flex flex-col items-center gap-4 py-4">
            <li>
              <Link
                to="https://www.youtube.com/@pickloadlogistics7714"
                target="_blank"
                rel="noreferrer"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Learn
              </Link>
            </li>
            <li>
              <Link
                to="/faqs"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                FAQs
              </Link>
            </li>
            <li>
              <Link
                to="/referral_login"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-green-600 font-medium transition-colors"
              >
                Refer a Friend
              </Link>
            </li>
            <li>
              <Link to="/downloadapp" onClick={() => setIsOpen(false)}>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Sign Up Now
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

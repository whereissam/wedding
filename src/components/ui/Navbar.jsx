import React from "react";
import logo from "../../assets/logo.svg";

/**
 * Navbar component that displays the logo in the top navigation bar
 * @returns {JSX.Element} Navbar component
 */
const Navbar = () => {
  return (
    <nav className="w-full bg-[#cef1f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex-shrink-0">
            <img className="h-12 w-auto" src={logo} alt="Logo" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

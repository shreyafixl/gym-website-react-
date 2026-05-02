import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/classes", label: "Classes" },
    { to: "/equipment", label: "Equipment" },
    { to: "/facilities", label: "Facilities" },
    { to: "/trainers", label: "Trainers" },
    { to: "/pricing", label: "Pricing" },
    { to: "/gallery", label: "Gallery" },
    { to: "/testimonials", label: "Testimonials" },
    { to: "/faq", label: "FAQ" },
    { to: "/contact", label: "Contact" }
  ];

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link to="/" className="navbar-logo" aria-label="FitZone Gym Home">
        <span className="logo-icon">⚡</span> FitZone
      </Link>

      {/* Desktop nav */}
      <ul className="navbar-links">
        {navLinks.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              end={link.to === "/"}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <Link to="/contact" className="navbar-cta">
        Join Now
      </Link>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
      >
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
        <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
      </button>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "mobile-menu--open" : ""}`}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                end={link.to === "/"}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link to="/contact" className="navbar-cta mobile-cta" onClick={() => setMenuOpen(false)}>
          Join Now
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

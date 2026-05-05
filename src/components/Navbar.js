import { useState, useCallback, useMemo } from "react";
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  // Memoize navLinks to prevent recreation on every render
  const navLinks = useMemo(() => [
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
    { to: "/contact", label: "Contact" },
    { to: "/dashboard", label: "Dashboard" }
  ], []);

  // Memoize callbacks to prevent unnecessary re-renders
  const toggleMenu = useCallback(() => {
    setMenuOpen(prev => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

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

      <div className="navbar-actions">
        <ThemeToggle />
        <Link to="/contact" className="navbar-cta">
          Join Now
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={toggleMenu}
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
                onClick={closeMenu}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <Link to="/contact" className="navbar-cta mobile-cta" onClick={closeMenu}>
          Join Now
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

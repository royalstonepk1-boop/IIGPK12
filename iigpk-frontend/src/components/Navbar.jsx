import { useState } from "react";
import { NavLink } from "react-router-dom";

const LOGO_URL =
  "https://ecomexpanding.com/iigpk/wp-content/uploads/2024/01/iigpk-logo.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white backdrop-blur border-b border-stone-900/10">
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <img
            src={LOGO_URL}
            alt="IIGPK logo"
            className="h-12 w-auto object-contain"
          />
        </NavLink>

        <ul className="hidden md:flex items-center gap-9 font-body text-sm font-semibold tracking-wide">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `uppercase tracking-widest text-xs pb-1 border-b-2 transition-colors ${
                    isActive
                      ? "border-gold-500 text-emerald-900"
                      : "border-transparent text-stone-700 hover:text-emerald-800 hover:border-gold-400/60"
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden p-2 -mr-2 text-emerald-900"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-stone-900/10 bg-ivory">
          <ul className="flex flex-col px-5 py-3 gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 text-sm font-semibold uppercase tracking-widest ${
                      isActive ? "text-emerald-900" : "text-stone-700"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

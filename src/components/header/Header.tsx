import type { ReactNode } from "react";
import { NavLink } from "react-router";

export default function Header({ children }: { children?: ReactNode }) {
  return (
    <header className="bg-white border-b">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <NavLink
            to="/"
            className="font-semibold text-xl text-shadow-slate-900"
          >
            Urbetrack
          </NavLink>
          <span className="lg:hidden">{children}</span>
        </div>
      </nav>
    </header>
  );
}

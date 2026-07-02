import { NavLink, Outlet } from "react-router";

export default function AppLayout() {
  return (
    <div className="flex min-h-svh">
      <nav className="w-56 border-r p-4 flex flex-col gap-2">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/mapa">Mapa</NavLink>
        <NavLink to="/incidentes">Incidentes</NavLink>
      </nav>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

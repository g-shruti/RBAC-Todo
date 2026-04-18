import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

import { ROUTES } from "../../constants/routes";

const navItems = [
  { label: "Dashboard", to: ROUTES.dashboard },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar-panel p-3">
      <p className="mb-3 text-uppercase small fw-semibold text-secondary">Workspace</p>
      <div className="d-grid gap-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={clsx("rounded-3 px-3 py-2", {
              "bg-primary text-white": location.pathname === item.to,
              "text-secondary": location.pathname !== item.to,
            })}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
};

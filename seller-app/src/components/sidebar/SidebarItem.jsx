import { NavLink } from "react-router-dom";

export default function SidebarItem({
  to,
  icon: Icon,
  title,
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300

        ${
          isActive
            ? "bg-white/10 text-white shadow-lg"
            : "text-slate-300 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-blue-500"></span>
          )}

          <Icon
            size={19}
            className="transition-transform duration-300 group-hover:scale-110"
          />

          <span className="text-[15px] font-medium">
            {title}
          </span>
        </>
      )}
    </NavLink>
  );
}
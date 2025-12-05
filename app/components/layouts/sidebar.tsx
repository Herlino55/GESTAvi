"use client";
import Icon from "@mdi/react";
import {
  mdiMessageOutline,
  mdiBellOutline,
  mdiMenu,
  mdiAccountMultiplePlusOutline,
  mdiCog,
  mdiLogout,
  mdiViewDashboard,
  mdiChartLine,
  mdiAccountMultipleOutline,
  mdiListBoxOutline,
} from "@mdi/js";
import { useRouter } from "next/navigation";

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <div
      className={`h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out flex flex-col py-6 w-[260px]`}
    >
      {/* Logo */}
      <h1 className="font-bold text-2xl text-gray-800 px-5">
        Instagram
      </h1>

      {/* Menu */}
      <ul className="mt-10 px-3 space-y-4 text-gray-700">
        <SidebarItem path="/admins/dashboard" label="Dashboard" icon={mdiViewDashboard} />
        <SidebarItem path="/admins/community" label="Community" icon={mdiListBoxOutline} />
        <SidebarItem path="/admins/statistics" label="Statistics" icon={mdiChartLine} />
        <SidebarItem path="/admins/view" label="Admins" icon={mdiAccountMultiplePlusOutline} />
        <SidebarItem path="/admins/users" label="Users" icon={mdiAccountMultipleOutline} />
        <SidebarItem path="/admins/messages" label="Messages" icon={mdiMessageOutline} />

        {/* Menu More */}
        <li className="relative group cursor-pointer hover:text-blue-600">
          <div className="flex items-center space-x-3">
            <Icon path={mdiMenu} size={1} />
            <span className="text-sm">More</span>
          </div>

          {/* Tooltip */}
          <div className="absolute left-40 top-0 bg-white border border-gray-300 rounded shadow-md p-2 z-20 hidden group-hover:block w-40">
            <ul>
              <li>
                <a
                  className="flex items-center px-2 py-1 border-b text-sm hover:text-blue-600"
                  href="/users/settings"
                >
                  <Icon path={mdiCog} size={0.8} className="mr-2" /> Settings
                </a>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-2 py-1 text-sm hover:text-blue-600"
                >
                  <Icon path={mdiLogout} size={0.8} className="mr-2" /> Logout
                </button>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};

// Composant réutilisable
function SidebarItem({
  path,
  label,
  icon,
}: {
  path: string;
  label: string;
  icon: string;
}) {
  return (
    <li>
      <a
        href={path}
        className="flex items-center space-x-3 hover:text-blue-600 transition"
      >
        <Icon path={icon} size={1} />
        <span className="text-sm">{label}</span>
      </a>
    </li>
  );
}

export default Sidebar;

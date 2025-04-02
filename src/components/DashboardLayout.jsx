import { Link, useLocation } from "react-router-dom";
import {
  Bars3Icon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { ThemeContext } from "./themeContext";
import { navItems } from "../constant";

function DashboardLayout({ children }) {
  const { pathname } = useLocation();
  const { toggleTheme, isDark } = useContext(ThemeContext);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 h-screen overflow-y-auto sticky top-0 flex-col border-r bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            DevToolV2
          </h2>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-yellow-300"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1">
          <nav className="space-y-1 px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-100"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-30 transform transition-transform duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:hidden ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            DevToolV2
          </h2>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-full py-4">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center p-3 rounded-lg transition ${
                  pathname === item.path
                    ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-100"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <button
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          DevToolV2
        </h2>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-yellow-300"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <SunIcon className="w-5 h-5" />
          ) : (
            <MoonIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen flex flex-col">
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 mt-20 mb-5 p-5 md:p-10 md:mt-0 md:mb-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

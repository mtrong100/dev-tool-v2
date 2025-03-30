import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  KeyIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";
import { ThemeContext } from "./themeContext";

const navItems = [
  { path: "/", icon: HomeIcon, label: "Home" },
  {
    path: "/lorem-generator",
    icon: DocumentTextIcon,
    label: "Lorem Generator",
  },
  { path: "/case-converter", icon: DocumentTextIcon, label: "Case Converter" },
  { path: "/password-generator", icon: KeyIcon, label: "Password Generator" },
  {
    path: "/letter-profile-generator",
    icon: UserIcon,
    label: "Letter Profile",
  },
  {
    path: "/image-cropper",
    icon: DocumentTextIcon,
    label: "Image Cropper",
  },
  {
    path: "/joke-generator",
    icon: DocumentTextIcon,
    label: "Joke Generator",
  },
  { path: "/text-formatter", icon: DocumentTextIcon, label: "Text Formatter" },
  {
    path: "/qr-code-generator",
    icon: DocumentTextIcon,
    label: "QR Code",
  },
  {
    path: "/random-number-generator",
    icon: DocumentTextIcon,
    label: "Random Number",
  },
  {
    path: "/css-gradient-generator",
    icon: DocumentTextIcon,
    label: "CSS Gradient",
  },
  {
    path: "/text-to-speech",
    icon: DocumentTextIcon,
    label: "Text to Speech",
  },
  {
    path: "/online-stopwatch",
    icon: DocumentTextIcon,
    label: "Online Stopwatch",
  },
  {
    path: "/todo-list-manager",
    icon: DocumentTextIcon,
    label: "Todo List Manager",
  },
  {
    path: "/json-to-csv",
    icon: DocumentTextIcon,
    label: "JSON to CSV",
  },
  {
    path: "/number-formatter",
    icon: DocumentTextIcon,
    label: "Number Formatter",
  },
  {
    path: "/color-converter",
    icon: DocumentTextIcon,
    label: "Color Converter",
  },
  {
    path: "/image-resizer",
    icon: DocumentTextIcon,
    label: "Image Resizer",
  },
  {
    path: "/json-formatter",
    icon: DocumentTextIcon,
    label: "JSON Formatter",
  },
  {
    path: "/uuid-generator",
    icon: DocumentTextIcon,
    label: "UUID Generator",
  },
];

function DashboardLayout({ children }) {
  const { pathname } = useLocation();
  const { toggleTheme, isDark } = useContext(ThemeContext);

  return (
    <div
      className={`min-h-screen flex ${isDark ? "bg-gray-900" : "bg-gray-100"}`}
    >
      {/* Sidebar */}
      <aside
        className={`hidden md:flex md:w-64 h-screen overflow-y-auto sticky top-0 flex-col border-r ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h2
            className={`text-2xl font-bold ${
              isDark ? "text-blue-400" : "text-blue-600"
            }`}
          >
            DevToolV2
          </h2>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${
              isDark
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
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
        <div className="flex-1 ">
          <nav className="space-y-1 px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition ${
                  isDark
                    ? pathname === item.path
                      ? "bg-blue-900 text-blue-100"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    : pathname === item.path
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
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
        <h2
          className={`text-xl font-bold ${
            isDark ? "text-blue-400" : "text-blue-600"
          }`}
        >
          DevToolV2
        </h2>
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full ${
            isDark ? "bg-gray-700 text-yellow-300" : "bg-gray-200 text-gray-700"
          }`}
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
        <main
          className={`flex-1 ${
            isDark ? "bg-gray-900" : "bg-gray-50"
          } pt-16 md:px-5 md:py-10`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;

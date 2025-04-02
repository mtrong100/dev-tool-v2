import React from "react";
import {
  CodeBracketIcon,
  DocumentTextIcon,
  PhotoIcon,
  ArrowRightIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const features = [
  {
    icon: DocumentTextIcon,
    title: "Text Tools",
    description:
      "Format, convert, and manipulate text with our powerful text utilities",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: CodeBracketIcon,
    title: "JSON Formatter",
    description: "Validate, format, and beautify JSON data with one click",
    color: "text-green-500 dark:text-green-400",
  },
  {
    icon: PhotoIcon,
    title: "Image Resizer",
    description: "Resize images effortlessly while preserving quality",
    color: "text-purple-500 dark:text-purple-400",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto ">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
            Welcome to DevToolV2
          </h1>
          <p className="mt-6 text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
            Supercharge your development workflow with our powerful utility
            tools. Everything you need in one place.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/case-converter"
              className="flex items-center px-8 py-4 rounded-lg shadow-lg font-medium text-lg transition-all bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </a>
            <a
              href="https://github.com/mtrong100/dev-tool-v2"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-8 py-4 rounded-lg font-medium text-lg transition-all bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white dark:border-gray-700"
            >
              <StarIcon className="mr-2 h-5 w-5" />
              Star on GitHub
            </a>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Powerful Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded-xl transition-all duration-300 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 mb-6">
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-24 p-8 rounded-xl bg-gray-100 dark:bg-gray-800 text-center">
          <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Loved by Developers Worldwide
          </h3>
          <div className="max-w-3xl mx-auto">
            <p className="text-xl italic mb-6 text-gray-600 dark:text-gray-300">
              "DevToolV2 has become an essential part of my daily workflow. The
              tools are fast, reliable, and save me hours of work every week."
            </p>
            <p className="font-medium text-gray-500 dark:text-gray-400">
              - TN Pro Vip
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

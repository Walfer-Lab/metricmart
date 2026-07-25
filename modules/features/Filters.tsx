'use client';
import { useState, useRef, useEffect } from "react";
import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Map our frontend UI text to the backend SQL parameter
export const FILTER_OPTIONS = [
  { label: "Relevance", value: "relevance" },
  { label: "Recently added", value: "recent" },
  { label: "Best-selling", value: "best_selling" },
  { label: "Price: high - low", value: "price_desc" },
  { label: "Price: low - high", value: "price_asc" },
];

export default function Filters({ 
  currentSort, 
  onSortChange 
}: { 
  currentSort: string, 
  onSortChange: (value: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-100 text-black/80 cursor-pointer rounded-md p-2 hover:bg-gray-200 transition-colors flex items-center gap-2"
        aria-label="Filter results"
      >
        <HugeiconsIcon icon={PreferenceHorizontalIcon} size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 flex flex-col p-1 gap-1 rounded-xl bg-gray-200 w-40 z-10 shadow-lg border border-gray-300">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setIsOpen(false);
              }}
              className={`text-left px-3 py-2 text-sm font-general font-medium rounded-md transition-colors cursor-pointer ${
                currentSort === option.value 
                  ? "bg-white text-black shadow-sm" // Highlight active filter
                  : "text-gray-800 hover:bg-gray-300/80"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
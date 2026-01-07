"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: number;
}

const ExpandableSearchBar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setShowHistory(false);

    setTimeout(() => {
      if (!isExpanded && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleSearch = (query: string = searchValue) => {
    if (query.trim()) {
      const newItem: SearchHistoryItem = {
        id: Date.now().toString(),
        query: query.trim(),
        timestamp: Date.now(),
      };
      setHistory((prev) => [newItem, ...prev].slice(0, 5)); // Keep last 5 searches
      setSearchValue("");
      setShowHistory(false);
      setIsExpanded(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setShowHistory(false);
  };

  const clearInput = () => {
    setSearchValue("");
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
        setShowHistory(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Escape") {
      setIsExpanded(false);
      setShowHistory(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <motion.div
        className={cn(
          "relative flex items-center rounded-full bg-background border border-input shadow-sm overflow-hidden",
          "hover:shadow-md transition-shadow",
        )}
        animate={{
          width: isExpanded ? "320px" : "40px",
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {/* Search Button */}
        <motion.button
          aria-label="Toggle Search"
          onClick={toggleExpand}
          className="absolute left-0 flex items-center justify-center w-10 h-10 cursor-pointer hover:bg-accent rounded-full transition-colors z-10"
          animate={{
            x: isExpanded ? "280px" : "0px",
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="h-5 w-5 text-muted-foreground" />
        </motion.button>

        {/* Search Input */}
        <motion.input
          type="text"
          placeholder="Search..."
          ref={searchInputRef}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowHistory(history.length > 0)}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex-1 bg-transparent border-none outline-none pl-14 pr-10 py-2 text-sm",
            "placeholder:text-muted-foreground",
          )}
          initial={{ opacity: 0 }}
          animate={{
            opacity: isExpanded ? 1 : 0,
          }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          disabled={!isExpanded}
        />

        {/* Clear Button - Shows when input has text */}
        <AnimatePresence>
          {isExpanded && searchValue && (
            <motion.button
              onClick={clearInput}
              className="absolute right-2 flex items-center justify-center w-6 h-6 cursor-pointer hover:bg-accent rounded-full transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Search History Dropdown */}
      <AnimatePresence>
        {isExpanded && showHistory && history.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 rounded-lg bg-background border border-input shadow-lg z-20"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              <p className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                Recent Searches
              </p>
              <div className="space-y-1">
                {history.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => handleSearch(item.query)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-accent transition-colors flex items-center gap-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: index * 0.03 }}
                    whileHover={{ x: 4 }}
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{item.query}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                onClick={clearHistory}
                className="w-full mt-2 text-left px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                whileHover={{ x: 4 }}
              >
                Clear History
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExpandableSearchBar;

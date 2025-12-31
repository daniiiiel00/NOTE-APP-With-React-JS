import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Moon,
  Sun,
  X,
  FileText,
} from "lucide-react";

// --- Utility: Generate ID ---
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Utility: Format Date ---
const formatDate = () => {
  const options = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date().toLocaleDateString("en-US", options);
};

// --- Component: Snowfall Effect ---
const Snowfall = ({ isDarkMode }) => {
  const snowflakes = Array.from({ length: 40 }); // Number of flakes

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((_, i) => {
        const size = Math.random() * 4 + 2;
        const initialX = Math.random() * 100;
        const duration = Math.random() * 10 + 7;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${initialX}vw`, opacity: 0 }}
            animate={{
              y: "110vh",
              opacity: [0, 0.8, 0.8, 0],
              x: [`${initialX}vw`, `${initialX + (Math.random() * 6 - 3)}vw`],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: "linear",
            }}
            className="rounded-full blur-[1px]"
            style={{
              position: "absolute",
              width: size,
              height: size,
              backgroundColor: isDarkMode ? "white" : "#94a3b8", // White in dark, slate in light
              boxShadow: isDarkMode ? "0 0 8px white" : "none",
            }}
          />
        );
      })}
    </div>
  );
};

// --- Component: Note Card ---
const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full transition-colors duration-300 group relative overflow-hidden"
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          note.color || "bg-blue-500"
        }`}
      />

      <div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 line-clamp-1">
          {note.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap line-clamp-4">
          {note.content}
        </p>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/50">
        <span className="text-xs text-gray-400 font-medium">{note.date}</span>

        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Component: Modal ---
const NoteModal = ({ isOpen, onClose, onSave, editingNote }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const MAX_CHARS = 300;

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() && !content.trim()) return;

    onSave({
      id: editingNote ? editingNote.id : generateId(),
      title: title || "Untitled Note",
      content,
      date: formatDate(),
      color:
        editingNote?.color ||
        ["bg-blue-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500"][
          Math.floor(Math.random() * 4)
        ],
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {editingNote ? "Edit Note" : "New Note"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-bold text-gray-800 dark:text-white bg-transparent outline-none placeholder-gray-300 dark:placeholder-gray-600 mb-4"
          />
          <textarea
            placeholder="Type your thoughts here..."
            value={content}
            onChange={(e) =>
              e.target.value.length <= MAX_CHARS && setContent(e.target.value)
            }
            rows={6}
            className="w-full text-gray-600 dark:text-gray-300 bg-transparent outline-none resize-none placeholder-gray-300 dark:placeholder-gray-600 text-lg leading-relaxed"
          />

          <div className="flex justify-between items-center mt-6">
            <span
              className={`text-xs font-medium ${
                content.length >= MAX_CHARS ? "text-red-500" : "text-gray-400"
              }`}
            >
              {content.length}/{MAX_CHARS}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-blue-500/30"
            >
              Save Note
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main App Component ---
export default function NotesApp() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("notes");
    return saved ? JSON.parse(saved) : [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const handleSaveNote = (note) => {
    if (editingNote) {
      setNotes(notes.map((n) => (n.id === note.id ? note : n)));
    } else {
      setNotes([note, ...notes]);
    }
    setEditingNote(null);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Snowfall Effect - Rendered first to stay in background */}
      <Snowfall isDarkMode={isDarkMode} />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NOTE APP
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100/80 dark:bg-gray-800/80 rounded-full px-4 py-2 w-64 focus-within:ring-2 ring-blue-500/50 transition-all">
              <Search size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
              />
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search Bar */}
        <div className="md:hidden mb-6">
          <div className="flex items-center bg-white/80 dark:bg-gray-800/80 rounded-full px-4 py-3 shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full text-gray-700 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                  onEdit={handleEditNote}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center mt-20 text-center"
          >
            <div className="bg-gray-100/50 dark:bg-gray-800/50 p-6 rounded-full mb-4">
              <FileText
                size={48}
                className="text-gray-300 dark:text-gray-600"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              {searchQuery ? "No matching notes found" : "No notes yet"}
            </h3>
            <p className="text-gray-500 max-w-xs mx-auto">
              {searchQuery
                ? "Try a different search term."
                : "Capture your ideas by creating a new note below."}
            </p>
          </motion.div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setEditingNote(null);
          setIsModalOpen(true);
        }}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-xl shadow-blue-600/40 z-30 hover:bg-blue-700 transition-colors"
      >
        <Plus size={28} />
      </motion.button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <NoteModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSaveNote}
            editingNote={editingNote}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// components/SidebarWithPrompt.jsx
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SendHorizonal } from "lucide-react";
import { API_PATHS, BASE_URL } from "../../utils/apiPaths";
import ReactMarkdown from "react-markdown";

export default function SidebarWithPrompt() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const newMessage = { role: "user", content: prompt.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setPrompt("");

    try {
      const res = await fetch(`${BASE_URL}${API_PATHS.AI.CHAT}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        console.error("API error:", res.status, errorText);
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "Server error: " + res.status },
        ]);
        return;
      }

      const data = await res.json();
      const botMessage = { role: "bot", content: data.reply || "No reply." };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Error fetching response." },
      ]);
    }
  };

  return (
    <div className="relative z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg transition-all"
      >
        Open Chat
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Sidebar */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full  md:w-[40vw] w-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                  AI Chatbot
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={` px-4 py-2 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-zinc-200 dark:bg-zinc-700 text-white self-end ml-auto max-w-[40%] w-fit"
                        : " text-zinc-800 dark:text-white self-start mr-auto"
                    }`}
                  >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                    {/* {msg.content} */}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-zinc-200 dark:border-zinc-700 flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type your message..."
                  className="focus:outline-none flex-1 px-3 py-2 rounded-md bg-white dark:bg-zinc-800 text-sm text-zinc-900 dark:text-white outline-none"
                />
                <button
                  onClick={handleSend}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md transition"
                >
                  <SendHorizonal size={18} />
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

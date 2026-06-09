import React, { useState, useEffect, useRef, useContext } from "react";
import { sendChatMessage } from "../services/chatbotApi";
import { StoreContext } from "../context/StoreContext";
import "../styles/chatbot.css";

const DEFAULT_SUGGESTIONS = [
  "Refund status",
  "Payment issue",
  "Login issue",
  "Contact support",
  "General Info"
];

const Chatbot = () => {
  const { user } = useContext(StoreContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  const messagesEndRef = useRef(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("electronify_chat_history");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Set initial bot message if history is empty
      const initialMessage = {
        id: "welcome",
        text: "Hello! Welcome to Electronify Support. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([initialMessage]);
      localStorage.setItem("electronify_chat_history", JSON.stringify([initialMessage]));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("electronify_chat_history", JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: `user-${Date.now()}`,
      text: textToSend,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);
    setSuggestions([]);

    try {
      // API call to backend
      const data = await sendChatMessage(textToSend);

      const botMsg = {
        id: `bot-${Date.now()}`,
        text: data.reply,
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);

      // Update suggestions
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions(DEFAULT_SUGGESTIONS);
      }
    } catch (error) {
      const errorMsg = {
        id: `bot-err-${Date.now()}`,
        text: "Sorry, I am having trouble connecting to the support server. Please make sure the backend server is running and try again.",
        sender: "bot",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
      setSuggestions(["Contact support"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };

  const clearHistory = () => {
    const initialMessage = {
      id: "welcome",
      text: "Chat history cleared. How can I help you today?",
      sender: "bot",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([initialMessage]);
    setSuggestions(DEFAULT_SUGGESTIONS);
    localStorage.setItem("electronify_chat_history", JSON.stringify([initialMessage]));
  };

  // Only render if a user session is active (logged in / signed up)
  if (!user) {
    return null;
  }

  return (
    <div className="chatbot-container">
      {/* Floating Label pointing to the button */}
      {!isOpen && (
        <div className="chatbot-floating-label">
          AI Assistant
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-trigger"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">🤖</div>
            <div>
              <h3 className="chatbot-title">AI Assistant</h3>
              <p className="chatbot-subtitle">Online • Customer Support</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={clearHistory}
              title="Clear chat history"
              style={{ background: "none", border: "none", color: "white", opacity: 0.7, cursor: "pointer", fontSize: "11px" }}
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="chatbot-close-btn"
              aria-label="Close Chat"
            >
              <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div>{msg.text}</div>
              <div className="message-timestamp">{msg.timestamp}</div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="chatbot-suggestions">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(suggestion)}
                className="suggestion-btn"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="chatbot-input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="chatbot-input"
            disabled={isLoading}
          />
          <button
            onClick={() => handleSendMessage(inputValue)}
            className="chatbot-send-btn"
            disabled={isLoading || !inputValue.trim()}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

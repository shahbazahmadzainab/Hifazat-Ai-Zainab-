import { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customMessage = null) => {
    const text = customMessage || message.trim();

    if (!text || loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://hifazat-ai-zainab.onrender.com/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Server response failed");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, Hifazat AI se response nahi aa saka. Please thori dair baad dobara try karein.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Mujhe suspicious link mila hai, kya karun?",
    "Kisi ne meri fake profile bana di hai.",
    "Online harassment se kaise protect karun?",
    "Mera account secure kaise karun?",
  ];

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🛡️</div>

        <div>
          <h1>Hifazat AI</h1>
          <p>Digital Safety Assistant</p>
        </div>
      </header>

      <main className="chat-container">
        {messages.length === 0 && (
          <div className="welcome">
            <div className="welcome-icon">🛡️</div>

            <h2>Welcome to Hifazat AI</h2>

            <p>
              Your digital safety assistant. Get simple and practical
              guidance about scams, harassment, privacy, account security
              and other online safety concerns.
            </p>

            <div className="suggested-section">
              <h3>How can I help?</h3>

              <div className="suggested-questions">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    className="suggested-question"
                    onClick={() => sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

<div className="safety-note">
  🛡️ <strong>Privacy & Safety:</strong> Never share passwords,
  OTPs, CNIC numbers, bank details, or private/intimate images.
  Hifazat AI provides general digital-safety guidance and is not a
  replacement for official emergency, legal, or law-enforcement services.
</div>

          </div>
        )}

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === "user" ? "user-message" : "ai-message"
              }`}
            >
              <div className="message-label">
                {msg.role === "user" ? "You" : "Hifazat AI"}
              </div>

              <div className="message-content">
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message ai-message">
              <div className="message-label">Hifazat AI</div>

              <div className="message-content">
                Thinking...
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="input-area">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Apna sawal likhein..."
          rows="1"
          aria-label="Type your question"
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading || !message.trim()}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default App;
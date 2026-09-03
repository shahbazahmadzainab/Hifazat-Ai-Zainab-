import { useState } from "react";
import "./App.css";

const BACKEND_URL =
  import.meta.env.VITE_API_URL ||
  "https://hifazat-ai-zainab.onrender.com";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [activeTool, setActiveTool] = useState(null);
  const [link, setLink] = useState("");
  const [harassmentType, setHarassmentType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    platform: "",
    details: "",
  });

  // 🎤 Voice input
  const [isListening, setIsListening] = useState(false);

  const suggestions = [
    "How can I protect my social media account?",
    "How do I recognize a phishing link?",
    "Someone is harassing me online. What should I do?",
    "How can I protect my privacy online?",
  ];

  const tools = [
    {
      id: "link",
      icon: "🔗",
      title: "Suspicious Link Checker",
      description: "Check a link for common scam and phishing signs.",
    },
    {
      id: "harassment",
      icon: "🛡️",
      title: "Online Harassment",
      description: "Get safe steps for dealing with online harassment.",
    },
    {
      id: "account",
      icon: "🔐",
      title: "Account Security",
      description: "Improve your account and password security.",
    },
    {
      id: "fake-profile",
      icon: "👤",
      title: "Fake Profile",
      description: "Get guidance for suspected fake profiles.",
    },
    {
      id: "privacy",
      icon: "🔒",
      title: "Privacy Check",
      description: "Learn how to protect your personal information.",
    },
    {
      id: "social-media",
      icon: "📱",
      title: "Social Media Safety",
      description: "Stay safer while using social media.",
    },
    {
      id: "scam",
      icon: "🚨",
      title: "Scam Investigation",
      description: "Get guidance when you suspect an online scam.",
    },
    {
      id: "photo-leak",
      icon: "🖼️",
      title: "Photo Leak Safety",
      description: "Get safe steps if a private photo is shared.",
    },
  ];

  // 🎤 Start / stop microphone
  const toggleMic = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Voice input is not supported in this browser. Please try Chrome."
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;

      setInput((prev) => {
        const current = prev.trim();

        if (!current) {
          return voiceText;
        }

        return `${current} ${voiceText}`;
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // 💬 Send message to backend
  const sendMessage = async (text = input) => {
    const cleanText = text.trim();

    if (!cleanText || loading) return;

    setError("");

    const userMessage = {
      role: "user",
      content: cleanText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: cleanText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();

      const answer =
        data.response ||
        data.answer ||
        data.message ||
        data.reply ||
        "Sorry, I could not generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: answer,
        },
      ]);
    } catch (err) {
      console.error(err);

      setError(
        "Unable to connect to Hifazat AI right now. Please check your backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const updateForm = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const openTool = (toolId) => {
    setActiveTool(toolId);
    setError("");
  };

  const closeTool = () => {
    setActiveTool(null);
    setLink("");
    setHarassmentType("");

    setFormData({
      name: "",
      username: "",
      platform: "",
      details: "",
    });
  };

  const useTool = async (prompt) => {
    closeTool();
    await sendMessage(prompt);
  };

  const checkLink = async () => {
    const cleanLink = link.trim();

    if (!cleanLink) return;

    await useTool(
      `Please check this link for common signs of phishing, scams, impersonation, or other suspicious behavior. Do not claim certainty unless there is reliable evidence. Link: ${cleanLink}`
    );
  };

  const submitHarassment = async () => {
    if (!harassmentType) return;

    await useTool(
      `I need safety guidance for online harassment. The situation involves: ${harassmentType}. Please give practical, age-appropriate safety, reporting, blocking, evidence-preservation, and trusted-adult guidance.`
    );
  };

  const submitAccountSecurity = async () => {
    await useTool(
      `Please give me practical steps to improve my online account security, including strong passwords, two-factor authentication, login alerts, recovery options, and what to do if I think my account is compromised.`
    );
  };

  const submitFakeProfile = async () => {
    const details = `
Name: ${formData.name}
Username: ${formData.username}
Platform: ${formData.platform}
Details: ${formData.details}
`;

    await useTool(
      `I suspect a fake profile. Please provide safe guidance for checking it, documenting evidence, reporting it to the platform, blocking it, and protecting my account. Do not try to identify, expose, track, or provide the private address/contact details of the person behind the account.

${details}`
    );
  };

  const submitPrivacy = async () => {
    await useTool(
      `Please give me a practical privacy check for social media and online accounts. Include privacy settings, location sharing, passwords, two-factor authentication, public information, app permissions, and safe sharing habits.`
    );
  };

  const submitSocialMedia = async () => {
    await useTool(
      `Please give me age-appropriate social media safety guidance, including privacy settings, blocking and reporting, avoiding suspicious links, protecting personal information, and what to do when someone makes me uncomfortable online.`
    );
  };

  const submitScam = async () => {
    await useTool(
      `I think I may be dealing with an online scam. Please explain safe steps to verify information, stop communication, preserve evidence, report the account, secure my accounts, and avoid sending money or personal information. Do not attempt to identify or expose a private person's home address or other private information.`
    );
  };

  const submitPhotoLeak = async () => {
    await useTool(
      `I am worried that a private photo may have been shared without permission. Please give safe, age-appropriate steps for preserving evidence, reporting the content and account to the platform, blocking the person, securing accounts, and telling a trusted adult. Do not ask me to forward or upload the private image, and do not try to identify, track, expose, or provide the private address of the person who shared it.`
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo-icon">🛡️</div>

          <div>
            <h1>Hifazat AI</h1>
            <p>Your Digital Safety Assistant</p>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Online
        </div>
      </header>

      <main className="main-layout">
        <section className="chat-container">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">🛡️</div>

              <h2>Welcome to Hifazat AI</h2>

              <p>
                Your friendly digital safety assistant. Ask questions about
                online privacy, scams, account security, harassment, fake
                profiles, and social media safety.
              </p>

              <div className="suggested-section">
                <h3>Try asking</h3>

                <div className="suggested-questions">
                  {suggestions.map((question) => (
                    <button
                      key={question}
                      className="suggested-question"
                      onClick={() => sendMessage(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>

              <div className="safety-note">
                <strong>🛡️ Safety first</strong>

                <p>
                  Never share passwords, OTP codes, bank details, or sensitive
                  personal information with anyone.
                </p>
              </div>
            </div>
          ) : (
            <div className="messages">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`message ${
                    message.role === "user"
                      ? "user-message"
                      : "ai-message"
                  }`}
                >
                  <div className="message-label">
                    {message.role === "user" ? "You" : "Hifazat AI"}
                  </div>

                  <div className="message-content">
                    {message.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message ai-message">
                  <div className="message-label">Hifazat AI</div>

                  <div className="message-content loading-text">
                    <div className="typing">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}
        </section>

        <aside className="functions-panel">
          <div className="functions-header">
            <div className="functions-icon">🛡️</div>

            <div>
              <h2>Safety Tools</h2>
              <p>Choose a tool</p>
            </div>
          </div>

          <div className="functions-list">
            {tools.map((tool) => (
              <button
                key={tool.id}
                className="function-card"
                onClick={() => openTool(tool.id)}
              >
                <div className="function-card-icon">{tool.icon}</div>

                <div className="function-card-text">
                  <strong>{tool.title}</strong>
                  <span>{tool.description}</span>
                </div>

                <div className="function-arrow">›</div>
              </button>
            ))}
          </div>

          <div className="functions-tip">
            <strong>💡 Safety Tip</strong>

            <p>
              Think before clicking links or sharing personal information
              online.
            </p>
          </div>
        </aside>
      </main>

      {/* MAIN CHAT INPUT */}
      <form className="input-area" onSubmit={handleSubmit}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Hifazat AI about digital safety..."
          rows="1"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        {/* 🎤 MIC BUTTON */}
        <button
          type="button"
          className={`mic-button ${isListening ? "listening" : ""}`}
          onClick={toggleMic}
          disabled={loading}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          🎤
        </button>

        {/* SEND BUTTON */}
        <button
          type="submit"
          disabled={!input.trim() || loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>

      <footer className="footer">
        <p>
          Hifazat AI provides safety guidance and does not replace emergency
          services or professional advice.
        </p>
      </footer>

      {/* TOOL POPUPS */}

      {activeTool === "link" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🔗 Suspicious Link Checker</h2>

            <p>
              Enter a link and Hifazat AI will explain common warning signs.
            </p>

            <input
              type="url"
              placeholder="https://example.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button className="check-button" onClick={checkLink}>
                Check Link
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTool === "harassment" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🛡️ Online Harassment</h2>

            <p>What is happening?</p>

            <select
              value={harassmentType}
              onChange={(e) => setHarassmentType(e.target.value)}
            >
              <option value="">Select an option</option>
              <option value="Repeated unwanted messages">
                Repeated unwanted messages
              </option>
              <option value="Threatening or intimidating messages">
                Threatening or intimidating messages
              </option>
              <option value="Someone is spreading rumors">
                Someone is spreading rumors
              </option>
              <option value="Someone is impersonating me">
                Someone is impersonating me
              </option>
              <option value="Other online harassment">
                Other online harassment
              </option>
            </select>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button className="check-button" onClick={submitHarassment}>
                Get Safety Steps
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTool === "account" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🔐 Account Security</h2>

            <p>
              Get practical steps to protect your account from unauthorized
              access.
            </p>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button
                className="check-button"
                onClick={submitAccountSecurity}
              >
                Get Safety Steps
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTool === "fake-profile" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>👤 Fake Profile</h2>

            <input
              type="text"
              placeholder="Name (optional)"
              value={formData.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />

            <input
              type="text"
              placeholder="Username (optional)"
              value={formData.username}
              onChange={(e) => updateForm("username", e.target.value)}
            />

            <input
              type="text"
              placeholder="Platform"
              value={formData.platform}
              onChange={(e) => updateForm("platform", e.target.value)}
            />

            <textarea
              placeholder="What happened?"
              value={formData.details}
              onChange={(e) => updateForm("details", e.target.value)}
            />

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button className="check-button" onClick={submitFakeProfile}>
                Get Safety Steps
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTool === "privacy" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🔒 Privacy Check</h2>

            <p>
              Get a simple privacy checklist for your accounts and social
              media.
            </p>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button className="check-button" onClick={submitPrivacy}>
                Check Privacy
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTool === "social-media" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>📱 Social Media Safety</h2>

            <p>
              Get practical tips for staying safer on social media platforms.
            </p>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button className="check-button" onClick={submitSocialMedia}>
                Get Safety Tips
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTool === "scam" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🚨 Scam Investigation</h2>

            <p>
              Get safe steps for handling a suspected online scam. Do not
              share passwords, OTPs, banking information, or other sensitive
              information.
            </p>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button className="check-button" onClick={submitScam}>
                Get Safety Steps
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTool === "photo-leak" && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>🖼️ Photo Leak Safety</h2>

            <p>
              Get safe steps if a private photo may have been shared without
              permission. Do not forward or upload the private image here.
            </p>

            <div className="popup-buttons">
              <button className="cancel-button" onClick={closeTool}>
                Cancel
              </button>

              <button className="check-button" onClick={submitPhotoLeak}>
                Get Safety Steps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
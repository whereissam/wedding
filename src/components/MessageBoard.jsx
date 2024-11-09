import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import PropTypes from "prop-types";
import gsap from "gsap";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const createSparkles = (container, originX, originY, count = 12) => {
  const sparkles = [];

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("div");
    sparkle.className = "sparkle";
    sparkle.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: #38b2ac;
      border-radius: 50%;
      pointer-events: none;
      z-index: 100;
    `;

    container.appendChild(sparkle);
    sparkles.push(sparkle);

    const angle = (i / count) * 360;
    const radius = Math.random() * 60 + 30;

    gsap.fromTo(
      sparkle,
      {
        x: originX,
        y: originY,
        scale: 1,
        opacity: 1,
      },
      {
        x: originX + Math.cos((angle * Math.PI) / 180) * radius,
        y: originY + Math.sin((angle * Math.PI) / 180) * radius,
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => sparkle.remove(),
      }
    );
  }
};

const createFirework = (container, originX, originY) => {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];
  const particles = [];
  const particleCount = 40;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "firework-particle";
    particle.style.cssText = `
      position: fixed;
      width: ${Math.random() * 12 + 6}px;
      height: ${Math.random() * 12 + 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 12px currentColor;
      mix-blend-mode: screen;
      left: ${originX}px;
      top: ${originY}px;
    `;

    container.appendChild(particle);
    particles.push(particle);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 6 + 2;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    gsap.to(particle, {
      x: vx * 150,
      y: vy * 150,
      scale: 0,
      opacity: 0,
      duration: 2,
      ease: "power2.out",
      onComplete: () => particle.remove(),
    });
  }
};

const createMultipleFireworks = (container, originX, originY) => {
  const fireworkCount = 3;
  const delay = 0.2; // Delay between each firework

  for (let i = 0; i < fireworkCount; i++) {
    setTimeout(
      () => {
        createFirework(
          container,
          originX + (Math.random() * 100 - 50), // Random spread
          originY + (Math.random() * 100 - 50) // Random spread
        );
      },
      i * delay * 1000
    );
  }
};

const MessageList = ({ messages }) => {
  const listRef = useRef(null);

  useEffect(() => {
    // Animate new messages when they appear
    if (listRef.current && listRef.current.children.length > 0) {
      const newMessage = listRef.current.children[0];
      gsap.fromTo(
        newMessage,
        {
          opacity: 0,
          y: -20,
          scale: 0.95,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [messages]);

  const celebratoryWords = ["新婚快樂", "百年好合", "早生貴子", "永浴愛河"];

  const renderMessageWithHearts = (text) => {
    let result = text;

    for (const word of celebratoryWords) {
      if (text.includes(word)) {
        const parts = text.split(word);
        result = (
          <p className="text-gray-700 whitespace-pre-wrap">
            {parts[0]}
            <span className="relative inline-flex items-center">
              <span className="congratulations-text">{word}</span>
              <span className="inline-block ml-2 hearts-animation">
                <span className="heart">❤️</span>
                <span className="heart">❤️</span>
                <span className="heart">❤️</span>
              </span>
            </span>
            {parts[1]}
          </p>
        );
        break; // Stop after first match to avoid nested JSX issues
      }
    }

    return result;
  };

  return (
    <div ref={listRef} className="max-w-4xl mx-auto p-4 space-y-4">
      <style>
        {`
          .congratulations-text {
            background: linear-gradient(
              45deg,
              #FF6B6B,
              #4ECDC4,
              #45B7D1,
              #FF69B4,
              #FFD700
            );
            background-size: 300% 300%;
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: bold;
            font-size: 1.1em;
            animation: rainbow 4s ease infinite;
            text-shadow: 0 0 10px rgba(255,255,255,0.5);
          }

          @keyframes rainbow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }

          .hearts-animation {
            position: relative;
            display: inline-block;
          }
          
          .heart {
            font-size: 1rem;
            position: relative;
            display: inline-block;
            animation: floatHeart 2s ease-in-out infinite;
            margin-left: 2px;
          }
          
          .heart:nth-child(1) {
            animation-delay: 0s;
          }
          
          .heart:nth-child(2) {
            animation-delay: 0.5s;
          }
          
          .heart:nth-child(3) {
            animation-delay: 1s;
          }
          
          @keyframes floatHeart {
            0%, 100% {
              transform: translateY(0) scale(1);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-5px) scale(1.1);
              opacity: 1;
            }
          }
        `}
      </style>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-white p-4 rounded-lg shadow-md transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-teal-700">{msg.name}</h3>
            <span className="text-sm text-gray-500">
              {new Date(msg.created_at).toLocaleString("zh-TW")}
            </span>
          </div>
          {renderMessageWithHearts(msg.message)}
        </div>
      ))}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      message: PropTypes.string,
      created_at: PropTypes.string,
    })
  ).isRequired,
};

const MessageForm = ({ onSubmit, loading }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);
  const containerRef = useRef(null);
  const fireworksContainerRef = useRef(null);

  const animateSubmit = () => {
    // Create fireworks container if it doesn't exist
    if (!fireworksContainerRef.current) {
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 1000;
      `;
      document.body.appendChild(container);
      fireworksContainerRef.current = container;
    }

    // Get the message board position
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Create multiple fireworks around the message board
    const positions = [
      { x: rect.left - 100, y: centerY },
      { x: rect.right + 100, y: centerY },
      { x: centerX, y: rect.top - 100 },
      { x: centerX, y: rect.bottom + 100 },
    ];

    // Stagger the fireworks
    positions.forEach((pos, index) => {
      setTimeout(() => {
        createFirework(fireworksContainerRef.current, pos.x, pos.y);
      }, index * 300);
    });

    // Button animation
    gsap.to(submitButtonRef.current, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
    });

    // Form animation
    gsap.fromTo(
      formRef.current,
      {
        y: 0,
        opacity: 1,
      },
      {
        y: -10,
        opacity: 0.7,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      }
    );

    // Increase cleanup timeout
    setTimeout(() => {
      if (fireworksContainerRef.current) {
        fireworksContainerRef.current.remove();
        fireworksContainerRef.current = null;
      }
    }, 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    animateSubmit(e);
    await onSubmit({ name: name.trim(), message: message.trim() });

    // Clear form with animation
    gsap.fromTo(
      formRef.current,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setName("");
          setMessage("");
          gsap.to(formRef.current, {
            opacity: 1,
            duration: 0.2,
          });
        },
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-4 relative" ref={containerRef}>
      <style>
        {`
          .firework-particle {
            filter: blur(1px);
            position: absolute;
            pointer-events: none;
          }
          
          .message-form-container {
            position: relative;
            overflow: visible;
          }

          @keyframes firework {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(0); opacity: 0; }
          }
        `}
      </style>
      <h2 className="text-2xl font-bold mb-6 text-teal-700">留言板</h2>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md transition-all duration-200 message-form-container"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">
            名字
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-700 mb-2">
            留言
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all duration-200"
            rows="4"
            required
          />
        </div>

        <button
          ref={submitButtonRef}
          type="submit"
          disabled={loading}
          className="relative bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-all duration-200 disabled:opacity-50 transform hover:scale-105 active:scale-95 overflow-visible"
        >
          {loading ? "發送中..." : "發送留言"}
        </button>
      </form>
    </div>
  );
};

MessageForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const useMessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    fetchMessages();

    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          setMessages((currentMessages) => [payload.new, ...currentMessages]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert([formData])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setMessages((currentMessages) => [data[0], ...currentMessages]);
      }
    } catch (error) {
      console.error("Error posting message:", error);
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, handleSubmit };
};

export { useMessageBoard as MessageBoard, MessageList, MessageForm };

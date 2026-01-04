const categories = {
  "💼 About ChuzeIT": {
    "What is ChuzeIT?":
      "ChuzeIT is a tech company offering custom websites, digital solutions, automation tools, and business-branding products.",
    "Why choose ChuzeIT?":
      "We focus on reliability, clean design, modern tech stack, and client-first solutions.",
    "What industries do you work with?":
      "We work with startups, small businesses, tech founders, and enterprise clients worldwide."
  },

  "🛠 Services": {
    "What services do you provide?":
      "We offer Web Development, App Development, UI/UX Design, Marketing Tools, Workflow Automations, and AI-powered solutions.",
    "Do you build custom websites?":
      "Yes! We design and build fully custom, responsive, professional-grade websites.",
    "Can you create automation systems?":
      "Absolutely. We build custom automation scripts, dashboards, and integrations to streamline business operations."
  },

  "📞 Support & Contact": {
    "How can I contact you?":
      "You can reach us anytime at support@chuzeit.com.",
    "Do you offer after-launch support?":
      "Yes. We provide maintenance, improvements, and long-term service support.",
    "Where are you located?":
      "We operate remotely and serve clients across the globe.",
    "Get In Touch": "scroll_to_contact"
  }
};

/* ------------------ CHAT BUBBLES ------------------ */

function createBubble(text, sender) {
  const chat = document.getElementById("chat-area");

  const row = document.createElement("div");
  row.className = "chat-row";

  if (sender === "bot") {
    const avatar = document.createElement("img");
    avatar.src = "./src/ChuzeIT-chatbot-profile-img-2.png";
    avatar.className = "chat-avatar";
    row.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${sender}`;
  bubble.textContent = text;

  row.appendChild(bubble);
  chat.appendChild(row);

  chat.scrollTop = chat.scrollHeight;

  try {
    document.getElementById("msgSound").play();
  } catch {}
}

/* ------------------ OPTIONS ------------------ */

function showCategories() {
  const options = document.getElementById("options");
  options.innerHTML = "";

  for (let cat in categories) {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = cat;
    btn.onclick = () => showQuestions(cat);
    options.appendChild(btn);
  }
}

function showQuestions(cat) {
  const options = document.getElementById("options");
  options.innerHTML = "";

  for (let q in categories[cat]) {
    const btn = document.createElement("button");
    btn.className = "option-btn option-btn-blue";
    btn.textContent = q;
    btn.onclick = () => answerQuestion(q, categories[cat][q], cat);
    options.appendChild(btn);
  }

  const backBtn = document.createElement("button");
  backBtn.className = "option-btn option-btn-back";
  backBtn.textContent = "⬅ Back";
  backBtn.onclick = showCategories;
  options.appendChild(backBtn);
}

/* ------------------ ANSWERS ------------------ */

function answerQuestion(q, ans, cat) {
  createBubble(q, "user");

  if (ans === "scroll_to_contact") {
    setTimeout(() => {
      closeChat();
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }, 300);
    return;
  }

  showTyping();

  setTimeout(() => {
    hideTyping();
    createBubble(ans, "bot");
  }, 800);

  setTimeout(() => showQuestions(cat), 1000);
}

/* ------------------ OPEN / CLOSE ------------------ */

document.getElementById("chat-toggle").onclick = () => {
  const chat = document.getElementById("chat-window");
  chat.style.display = "flex";
  chat.style.animation = "fadeInUp 0.3s ease-out";

  document.getElementById("chat-area").innerHTML = "";

  showTyping();

  setTimeout(() => {
    hideTyping();
    createBubble("What question is on your mind?", "bot");
    showCategories();
  }, 900);

  document.getElementById("chat-toggle").style.display = "none";
};

document.getElementById("close-chat").onclick = closeChat;

function closeChat() {
  document.getElementById("chat-window").style.display = "none";
  document.getElementById("chat-toggle").style.display = "flex";
}

/* ------------------ TYPING INDICATOR ------------------ */

function showTyping() {
  const chat = document.getElementById("chat-area");

  const row = document.createElement("div");
  row.className = "chat-row";
  row.id = "typingRow";

  const avatar = document.createElement("img");
  avatar.src = "./src/ChuzeIT-chatbot-profile-img-2.png";
  avatar.className = "chat-avatar";

  const typing = document.createElement("div");
  typing.className = "typing-indicator";
  typing.textContent = "Assistant is typing…";

  row.appendChild(avatar);
  row.appendChild(typing);
  chat.appendChild(row);

  chat.scrollTop = chat.scrollHeight;
}

function hideTyping() {
  document.getElementById("typingRow")?.remove();
}

/* ------------------ SOUND ------------------ */

document.getElementById("msgSound").volume = 0.2;

document.addEventListener("click", () => {
  document.getElementById("msgSound").play().catch(() => {});
}, { once: true });

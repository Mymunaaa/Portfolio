// ===== Dark mode toggle =====
const themeToggle = document.getElementById("themeToggle");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const rootEl = document.documentElement;

function applyTheme(theme) {
  if (theme === "dark") {
    rootEl.setAttribute("data-theme", "dark");
    if (themeToggleIcon) themeToggleIcon.textContent = "☀️";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", "true");
  } else {
    rootEl.removeAttribute("data-theme");
    if (themeToggleIcon) themeToggleIcon.textContent = "🌙";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", "false");
  }
}

const savedTheme = localStorage.getItem("portfolio-theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = rootEl.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("portfolio-theme", next);
  });
}

// ===== Floating olives (hero background only) =====
const oliveField = document.getElementById("oliveField");
if (oliveField) {
  const OLIVE_COUNT = 10;
  for (let i = 0; i < OLIVE_COUNT; i++) {
    const olive = document.createElement("span");
    olive.className = "olive";
    oliveField.appendChild(olive);
  }
}

// ===== Mobile navigation toggle =====
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== Contact form =====
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "Please fill in every field before sending.";
      formStatus.style.color = "#b3452c";
      return;
    }

    formStatus.textContent = `Thanks, ${name}! Your message has been noted — I'll reply at ${email} soon.`;
    formStatus.style.color = "#c08a3e";
    contactForm.reset();
  });
}

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// ===== Custom Cursor =====
const cursor = document.querySelector(".custom-cursor");
const dot = document.querySelector(".custom-cursor-dot");

if (cursor && dot) {
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
  });

  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "0.6";
    dot.style.opacity = "0.8";
  });

  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
    dot.style.opacity = "0";
  });
}

// ===== Typewriter Effect =====
const typingText = document.getElementById("typing-text");

const texts = [
  "University of Asia Pacific",
  "Department of CSE"
];
let textIndex = 0;
let charIndex = 0;
let deleting = false;

function typeWriter() {
  const currentText = texts[textIndex];

  if (!deleting) {
    typingText.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentText.length) {
      deleting = true;
      setTimeout(typeWriter, 1800);
      return;
    }

    setTimeout(typeWriter, 80);
  } else {
    typingText.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeWriter, 400);
      return;
    }

    setTimeout(typeWriter, 40);
  }
}

if (typingText) {
  typeWriter();
}

// ===== Typing effect for Education & Work =====
// Runs when each tag scrolls into view (not on page load), so the effect is
// actually visible instead of finishing before the section is ever seen.
const typingTags = document.querySelectorAll(".typing-tag");

typingTags.forEach((tag) => {
  const fullText = tag.dataset.fullText || tag.textContent;
  tag.dataset.fullText = fullText;
  tag.textContent = "";
});

const typingTagObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const tag = entry.target;
    if (tag.dataset.typed === "true") return;
    tag.dataset.typed = "true";

    const text = tag.dataset.fullText;
    let i = 0;

    function typeTag() {
      if (i < text.length) {
        tag.textContent += text.charAt(i);
        i++;
        setTimeout(typeTag, 100);
      }
    }

    typeTag();
    typingTagObserver.unobserve(tag);
  });
}, { threshold: 0.4 });

typingTags.forEach((tag) => typingTagObserver.observe(tag));

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animation = getAnimation(entry.target);
      // Gradual, ordered reveal for the About Me boxes: Currently first,
      // then Department, University, Name — final layout is unchanged.
      if (entry.target.classList.contains("about-card") && entry.target.dataset.revealDelay) {
        entry.target.style.animationDelay = entry.target.dataset.revealDelay;
      }
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

function getAnimation(element) {
  if (element.classList.contains("project-layout")) {
    return "fadeInUp 0.8s var(--transition-smooth) forwards";
  }
  if (element.classList.contains("project-box")) {
    return "slideInUp 0.6s var(--transition-smooth) forwards";
  }
  if (element.classList.contains("chip")) {
    return "fadeInUp 0.6s var(--transition-smooth) forwards";
  }
  if (element.classList.contains("about-card")) {
    return "fadeInUp 0.6s var(--transition-smooth) forwards";
  }
  return "fadeInUp 0.8s var(--transition-smooth) forwards";
}

// Observe elements
document.querySelectorAll(".project-layout, .project-box, .chip, .hobby-card, .skill-badge, .about-card").forEach((el) => {
  observer.observe(el);
});

// ===== MOUSE PARALLAX ON ILLUSTRATIONS =====
const hotelSVG = document.querySelector(".hotel-svg");
const logisticsSVG = document.querySelector(".logistics-svg");

if (hotelSVG) {
  const hotelContainer = hotelSVG.closest(".hotel-illustration");
  
  if (hotelContainer) {
    hotelContainer.addEventListener("mousemove", (e) => {
      const rect = hotelContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const mainHotel = document.getElementById("main-hotel");
      const key = document.getElementById("key");
      const bookingCard = document.getElementById("booking-card");
      const bell = document.getElementById("bell");

      if (mainHotel) {
        mainHotel.style.transform = `translateX(${x * 8}px) translateY(${y * 8}px)`;
      }
      if (key) {
        key.style.transform = `translateX(${x * 12}px) translateY(${y * 12}px) rotate(var(--rotation, 0deg))`;
      }
      if (bookingCard) {
        bookingCard.style.transform = `translateX(${x * 10}px) translateY(${y * 10}px)`;
      }
      if (bell) {
        bell.style.transform = `translateX(${x * 6}px) translateY(${y * 6}px)`;
      }
    });

    hotelContainer.addEventListener("mouseleave", () => {
      const mainHotel = document.getElementById("main-hotel");
      const key = document.getElementById("key");
      const bookingCard = document.getElementById("booking-card");
      const bell = document.getElementById("bell");

      if (mainHotel) mainHotel.style.transform = "";
      if (key) key.style.transform = "";
      if (bookingCard) bookingCard.style.transform = "";
      if (bell) bell.style.transform = "";
    });
  }
}

if (logisticsSVG) {
  const logisticsContainer = logisticsSVG.closest(".logistics-illustration");
  
  if (logisticsContainer) {
    logisticsContainer.addEventListener("mousemove", (e) => {
      const rect = logisticsContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const ship = document.getElementById("ship");
      const containers1 = document.getElementById("container-1");
      const containers2 = document.getElementById("container-2");
      const airplane = document.getElementById("airplane");
      const truck = document.getElementById("truck");

      if (ship) ship.style.transform = `translateX(${x * 6}px) translateY(${y * 6}px)`;
      if (containers1) containers1.style.transform = `translateX(${x * 8}px) translateY(${y * 8}px)`;
      if (containers2) containers2.style.transform = `translateX(${x * 8}px) translateY(${y * 8}px)`;
      if (airplane) airplane.style.transform = `translateX(${x * 10}px) translateY(${y * 10}px)`;
      if (truck) truck.style.transform = `translateX(${x * 7}px) translateY(${y * 7}px)`;
    });

    logisticsContainer.addEventListener("mouseleave", () => {
      const ship = document.getElementById("ship");
      const containers1 = document.getElementById("container-1");
      const containers2 = document.getElementById("container-2");
      const airplane = document.getElementById("airplane");
      const truck = document.getElementById("truck");

      if (ship) ship.style.transform = "";
      if (containers1) containers1.style.transform = "";
      if (containers2) containers2.style.transform = "";
      if (airplane) airplane.style.transform = "";
      if (truck) truck.style.transform = "";
    });
  }
}

// ===== PROJECT BOX HOVER LIFT =====
document.querySelectorAll(".project-box").forEach((box) => {
  box.addEventListener("mouseenter", () => {
    box.style.transform = "translateY(-8px)";
  });

  box.addEventListener("mouseleave", () => {
    box.style.transform = "translateY(0)";
  });
});

// ===== SMOOTH SCROLL TO SECTION =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href !== "#home") {
      e.preventDefault();
      const targetElement = document.querySelector(href);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  });
});

// ===== TECH TAG HOVER GLOW =====
document.querySelectorAll(".tech-tag").forEach((tag) => {
  tag.addEventListener("mouseenter", () => {
    tag.style.boxShadow = "0 8px 20px rgba(105, 97, 21, 0.4)";
  });

  tag.addEventListener("mouseleave", () => {
    tag.style.boxShadow = "none";
  });
});

// ===== ENHANCED SVG DRAWING ANIMATION =====
function animateSVGStroke(svg) {
  const paths = svg.querySelectorAll("line, path, rect");
  
  paths.forEach((path) => {
    if (path.tagName === "line" || path.tagName === "path") {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.animation = `drawStroke 1.5s ease-in-out forwards`;
    }
  });
}

// ===== ADD CSS FOR DRAWING ANIMATION =====
if (!document.querySelector("style[data-draw-animation]")) {
  const style = document.createElement("style");
  style.setAttribute("data-draw-animation", "true");
  style.textContent = `
    @keyframes drawStroke {
      to {
        stroke-dashoffset: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Apply drawing animation on scroll
const drawObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const svg = entry.target.querySelector("svg");
      if (svg) {
        animateSVGStroke(svg);
        drawObserver.unobserve(entry.target);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll(".project-illustration").forEach((el) => {
  drawObserver.observe(el);
});

console.log("Portfolio loaded with enhanced animations!");

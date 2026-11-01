/* ============================================================
   Language (Arabic / English)
   ============================================================ */
const root = document.documentElement;
const langBtn = document.getElementById("langBtn");
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const metaDescription = document.querySelector('meta[name="description"]');

const TITLES = {
  ar: "محمد قنديل — مطوّر Full Stack .NET",
  en: "Mohamed Kandil — Full Stack .NET Developer",
};

const DESCRIPTIONS = {
  ar: "بورتفوليو محمد قنديل: مطوّر Full Stack .NET بخبرة في بناء أنظمة ERP وتطبيقات ويب باستخدام C# وASP.NET Core وSQL Server.",
  en: "Portfolio of Mohamed Kandil, a Full Stack .NET developer building ERP systems and web applications with C#, ASP.NET Core and SQL Server.",
};

let currentLang = root.lang === "en" ? "en" : "ar";

function menuLabel(open, lang) {
  if (lang === "en") return open ? "Close menu" : "Open menu";
  return open ? "إغلاق القائمة" : "فتح القائمة";
}

function applyLang(lang) {
  const isEn = lang === "en";

  root.lang = isEn ? "en" : "ar";
  root.dir = isEn ? "ltr" : "rtl";

  document.querySelectorAll("[data-en]").forEach((el) => {
    if (!el.dataset.ar) el.dataset.ar = el.innerHTML;
    el.innerHTML = isEn ? el.dataset.en : el.dataset.ar;
  });

  document.querySelectorAll("[data-en-aria]").forEach((el) => {
    if (!el.dataset.arAria) el.dataset.arAria = el.getAttribute("aria-label") || "";
    el.setAttribute("aria-label", isEn ? el.dataset.enAria : el.dataset.arAria);
  });

  document.querySelectorAll("[data-en-alt]").forEach((el) => {
    if (!el.dataset.arAlt) el.dataset.arAlt = el.getAttribute("alt") || "";
    el.setAttribute("alt", isEn ? el.dataset.enAlt : el.dataset.arAlt);
  });

  document.title = TITLES[lang];
  metaDescription?.setAttribute("content", DESCRIPTIONS[lang]);

  if (langBtn) {
    langBtn.textContent = isEn ? "ع" : "EN";
    langBtn.lang = isEn ? "ar" : "en";
    langBtn.setAttribute(
      "aria-label",
      isEn ? "ع — التبديل إلى العربية" : "EN — Switch to English"
    );
  }

  if (menuBtn) {
    menuBtn.setAttribute(
      "aria-label",
      menuLabel(nav?.classList.contains("open") || false, lang)
    );
  }

  try {
    localStorage.setItem("lang", lang);
  } catch (e) {}

  currentLang = lang;
}

langBtn?.addEventListener("click", () => {
  applyLang(currentLang === "ar" ? "en" : "ar");
});

applyLang(currentLang);

/* ============================================================
   Theme
   ============================================================ */
const themeToggle = document.getElementById("themeToggle");
const themeColor = document.querySelector('meta[name="theme-color"]');

const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

applyTheme(initialTheme);

function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
    themeToggle?.setAttribute("aria-pressed", "true");
    themeColor?.setAttribute("content", "#0e0c0a");
  } else {
    root.removeAttribute("data-theme");
    themeToggle?.setAttribute("aria-pressed", "false");
    themeColor?.setAttribute("content", "#f7f3ec");
  }
}

themeToggle?.addEventListener("click", () => {
  const next = root.hasAttribute("data-theme") ? "light" : "dark";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

/* ============================================================
   Mobile menu
   ============================================================ */
menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", menuLabel(open, currentLang));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    menuBtn?.setAttribute("aria-label", menuLabel(false, currentLang));
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav?.classList.contains("open")) {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
    menuBtn?.setAttribute("aria-label", menuLabel(false, currentLang));
    menuBtn?.focus();
  }
});

/* ============================================================
   Header state + scroll progress
   ============================================================ */
const header = document.getElementById("header");
const progress = document.getElementById("progress");

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 8);

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(y / max, 1) : 0;
  if (progress) progress.style.width = `${ratio * 100}%`;
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* ============================================================
   Reveal on scroll
   ============================================================ */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`;
    observer.observe(el);
  });
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* ============================================================
   Footer year
   ============================================================ */
const year = document.getElementById("year");
if (year) year.textContent = String(new Date().getFullYear());

const header = document.querySelector(".header");
const menu = document.querySelector(".menu-bar .bar");
const navbar = document.querySelector(".righted-header");
const items = document.querySelectorAll(".righted-header .righted-navbar .nav-item");
const desktopItems = document.querySelectorAll(".header .right-side .item");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const progressButton = document.querySelector("#pageProgress");
const quickLinksToggle = document.querySelector("#footerQuickLinksToggle");
const quickLinksMenu = document.querySelector("#footerQuickLinksMenu");
const sections = document.querySelectorAll("section[id], div[id], footer[id]");

let isOpen = false;
let scrollTicking = false;

function toggleMenu(forceState) {
  isOpen = typeof forceState === "boolean" ? forceState : !isOpen;

  menu.classList.toggle("open", isOpen);
  navbar.classList.toggle("righted", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

function checkScroll() {
  if (!header || !menu) {
    return;
  }

  if (window.scrollY >= 120) {
    header.classList.add("nav-bar-scroll");
    menu.classList.add("navbar-color");
    return;
  }

  header.classList.remove("nav-bar-scroll");
  menu.classList.remove("navbar-color");
}

function getHeaderOffset() {
  return header ? header.offsetHeight + 20 : 96;
}

function scrollToSection(selector) {
  const target = document.querySelector(selector);

  if (!target) {
    return;
  }

  const scrollTop = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
  window.scrollTo({ top: scrollTop, behavior: "smooth" });

  window.setTimeout(() => {
    const correctedScrollTop =
      target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top: correctedScrollTop, behavior: "smooth" });
  }, 450);
}

function setActiveLinks() {
  let activeSection = "home";

  sections.forEach((section) => {
    const top = section.offsetTop - 180;
    const bottom = top + section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < bottom) {
      activeSection = section.id;
    }
  });

  [...items, ...desktopItems].forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeSection}`;
    link.classList.toggle("is-active", isActive);
  });
}

function updateProgress() {
  if (!progressButton) {
    return;
  }

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 360 : 0;
  const progressRing = progressButton.querySelector(".page-progress-ring");

  if (progressRing) {
    progressRing.style.background = `conic-gradient(#2126a3 ${progress}deg, rgba(33, 38, 163, .16) ${progress}deg)`;
  }
}

function handleScroll() {
  if (scrollTicking) {
    return;
  }

  window.requestAnimationFrame(() => {
    checkScroll();
    setActiveLinks();
    updateProgress();
    scrollTicking = false;
  });

  scrollTicking = true;
}

document.addEventListener("DOMContentLoaded", () => {
  checkScroll();
  setActiveLinks();
  updateProgress();

  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
    });
  }

  if (typeof lightGallery !== "undefined") {
    const galleryGrid = document.getElementById("galleryGrid");

    if (galleryGrid) {
      lightGallery(galleryGrid, {
        selector: ".item",
        download: false,
      });
    }
  }

  if (typeof Swiper !== "undefined") {
    new Swiper(".reviews", {
      loop: true,
      speed: 700,
      spaceBetween: 24,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
      },
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
        1440: { slidesPerView: 4 },
      },
    });
  }

  if (quickLinksToggle && quickLinksMenu) {
    quickLinksToggle.addEventListener("click", () => {
      const isExpanded = quickLinksToggle.getAttribute("aria-expanded") === "true";
      quickLinksToggle.setAttribute("aria-expanded", String(!isExpanded));
      quickLinksMenu.classList.toggle("is-collapsed", isExpanded);
      quickLinksToggle.querySelector(".footer-toggle-icon").textContent = isExpanded ? "+" : "-";
    });
  }

  if (progressButton) {
    progressButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
});

window.addEventListener("scroll", handleScroll, { passive: true });

if (menu) {
  menu.addEventListener("click", () => {
    toggleMenu();
  });
}

[...items, ...desktopItems].forEach((link) => {
  link.addEventListener("click", () => {
    toggleMenu(false);
  });
});

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.getAttribute("href");

    if (!target || target === "#" || !document.querySelector(target)) {
      return;
    }

    event.preventDefault();
    toggleMenu(false);
    history.replaceState(null, "", target);
    scrollToSection(target);
  });
});

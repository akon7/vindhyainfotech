const header = document.querySelector(".header");
const menu = document.querySelector(".menu-bar");
const menuIcon = document.querySelector(".menu-bar .bar");
const navbar = document.querySelector(".righted-header");
const items = document.querySelectorAll(".righted-header .righted-navbar .nav-item");
const desktopItems = document.querySelectorAll(".header .right-side .item");
const anchorLinks = document.querySelectorAll('a[href^="#"]');
const progressButton = document.querySelector("#pageProgress");
const quickLinksToggle = document.querySelector("#footerQuickLinksToggle");
const quickLinksMenu = document.querySelector("#footerQuickLinksMenu");
const sections = document.querySelectorAll("section[id], div[id], footer[id]");
const serviceGrid = document.querySelector(".section-services .services-content .row");
const reviewsWrapper = document.querySelector(".section-reviews .reviews .swiper-wrapper");
const clientGrid = document.querySelector("#clientGrid");

let isOpen = false;
let scrollTicking = false;

function toggleMenu(forceState) {
  isOpen = typeof forceState === "boolean" ? forceState : !isOpen;

  if (menuIcon) {
    menuIcon.classList.toggle("open", isOpen);
  }
  if (navbar) {
    navbar.classList.toggle("righted", isOpen);
  }
  document.body.classList.toggle("menu-open", isOpen);
}

function checkScroll() {
  if (!header || !menu) {
    return;
  }

if (window.scrollY >= 120) {
    header.classList.add("nav-bar-scroll");
    if (menuIcon) {
      menuIcon.classList.add("navbar-color");
    }
    return;
  }

  header.classList.remove("nav-bar-scroll");
  if (menuIcon) {
    menuIcon.classList.remove("navbar-color");
  }
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeIconClass(value) {
  const fallback = "fas fa-tools";
  const iconClass = String(value || "").trim();

  return /^[a-z0-9\-\s]+$/i.test(iconClass) ? iconClass : fallback;
}

function normalizeRating(value) {
  return Math.max(1, Math.min(5, Number(value) || 5));
}

function starsMarkup(rating) {
  return Array.from({ length: normalizeRating(rating) }, () => '<i class="fas fa-star"></i>').join("");
}

function getManagedContent() {
  const source = window.VINHYA_CONTENT || {};

  try {
    const draft = JSON.parse(localStorage.getItem("vindhyaContentDraft") || "null");

    if (
      draft &&
      (Array.isArray(draft.services) || Array.isArray(draft.reviews) || Array.isArray(draft.clients))
    ) {
      return draft;
    }
  } catch {
    return source;
  }

  return source;
}

function renderManagedServices(services) {
  if (!serviceGrid || !Array.isArray(services)) {
    return;
  }

  if (!services.length) {
    serviceGrid.innerHTML = '<div class="col-12 text-center text-muted fw-bold">No services are published yet.</div>';
    return;
  }

  serviceGrid.innerHTML = services
    .map((service, index) => {
      const delay = 150 + index * 70;

      return `
        <div class="c col-xl-3 col-lg-4 col-md-6 col-10 rounded" data-aos="fade-down" data-aos-delay="${delay}">
          <div class="card p-3 shadow">
            <div class="service-icon mb-3"><i class="${normalizeIconClass(service.icon)}"></i></div>
            <h6 class="service-title mb-3">${escapeHtml(service.title || "")}</h6>
            <p class="service-desc mb-0">${escapeHtml(service.desc || "")}</p>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderManagedReviews(reviews) {
  if (!reviewsWrapper || !Array.isArray(reviews)) {
    return;
  }

  if (!reviews.length) {
    reviewsWrapper.innerHTML = '<div class="swiper-slide"><article class="story-card h-100 p-4 shadow-sm text-center text-muted fw-bold">No reviews are published yet.</article></div>';
    return;
  }

  reviewsWrapper.innerHTML = reviews
    .map((review, index) => {
      const delay = 120 + index * 40;

      return `
        <div class="swiper-slide" data-aos="fade-up" data-aos-delay="${delay}">
          <article class="story-card h-100 p-4 shadow-sm">
            <div class="story-top d-flex align-items-center mb-3">
              <div class="story-avatar me-3"><span>${escapeHtml(review.initials || "")}</span></div>
              <div class="story-meta"><h5 class="story-name mb-1">${escapeHtml(review.name || "")}</h5></div>
            </div>
            <div class="story-service mb-3"><span>${escapeHtml(review.service || "")}</span></div>
            <div class="story-stars mb-3">${starsMarkup(review.rating)}</div>
            <p class="story-desc mb-0">${escapeHtml(review.desc || "")}</p>
          </article>
        </div>
      `;
    })
    .join("");
}

function safeImageSource(value) {
  const source = String(value || "").trim();

  if (!source) {
    return "";
  }

  if (/^(https?:)?\/\//i.test(source) || /^images\//i.test(source) || /^\.{0,2}\//.test(source)) {
    return source.replaceAll('"', "%22");
  }

  if (/^[a-z0-9][a-z0-9._\-\s/]*\.(png|jpe?g|webp|gif|svg)$/i.test(source)) {
    return `images/${source}`.replaceAll('"', "%22");
  }

  return "";
}

function initialsFromName(name) {
  return String(name || "Client")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function renderManagedClients(clients) {
  if (!clientGrid || !Array.isArray(clients)) {
    return;
  }

  if (!clients.length) {
    clientGrid.innerHTML = '<div class="col-12 text-center text-muted fw-bold">Client logos can be added from the admin panel.</div>';
    return;
  }

  clientGrid.innerHTML = clients
    .map((client) => {
      const name = escapeHtml(client.name || "Client");
      const logo = safeImageSource(client.logo);
      const logoMarkup = logo
        ? `<img src="${logo}" alt="${name} logo" loading="lazy" decoding="async">`
        : `<span>${escapeHtml(initialsFromName(client.name))}</span>`;

      return `
        <div class="client-card">
          <div class="client-logo">${logoMarkup}</div>
          <p class="client-name mb-0">${name}</p>
        </div>
      `;
    })
    .join("");
}

function renderManagedContent() {
  const content = getManagedContent();

  renderManagedServices(content.services);
  renderManagedReviews(content.reviews);
  renderManagedClients(content.clients);
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
  renderManagedContent();
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

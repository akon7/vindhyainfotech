const STORAGE_KEY = "vindhyaContentDraft";

const els = {
  serviceForm: document.getElementById("serviceForm"),
  serviceEditIndex: document.getElementById("serviceEditIndex"),
  serviceTitle: document.getElementById("serviceTitle"),
  serviceIcon: document.getElementById("serviceIcon"),
  serviceDesc: document.getElementById("serviceDesc"),
  serviceEditingLabel: document.getElementById("serviceEditingLabel"),
  serviceSubmitBtn: document.getElementById("serviceSubmitBtn"),
  serviceCancelBtn: document.getElementById("serviceCancelBtn"),
  serviceList: document.getElementById("serviceList"),
  serviceCount: document.getElementById("serviceCount"),
  reviewForm: document.getElementById("reviewForm"),
  reviewEditIndex: document.getElementById("reviewEditIndex"),
  reviewInitials: document.getElementById("reviewInitials"),
  reviewName: document.getElementById("reviewName"),
  reviewService: document.getElementById("reviewService"),
  reviewRating: document.getElementById("reviewRating"),
  reviewDesc: document.getElementById("reviewDesc"),
  reviewEditingLabel: document.getElementById("reviewEditingLabel"),
  reviewSubmitBtn: document.getElementById("reviewSubmitBtn"),
  reviewCancelBtn: document.getElementById("reviewCancelBtn"),
  reviewList: document.getElementById("reviewList"),
  reviewCount: document.getElementById("reviewCount"),
  clientForm: document.getElementById("clientForm"),
  clientEditIndex: document.getElementById("clientEditIndex"),
  clientName: document.getElementById("clientName"),
  clientLogo: document.getElementById("clientLogo"),
  clientEditingLabel: document.getElementById("clientEditingLabel"),
  clientSubmitBtn: document.getElementById("clientSubmitBtn"),
  clientCancelBtn: document.getElementById("clientCancelBtn"),
  clientList: document.getElementById("clientList"),
  clientCount: document.getElementById("clientCount"),
  downloadJsBtn: document.getElementById("downloadJsBtn"),
  downloadJsonBtn: document.getElementById("downloadJsonBtn"),
  copyJsonBtn: document.getElementById("copyJsonBtn"),
  importFileInput: document.getElementById("importFileInput"),
  resetBtn: document.getElementById("resetBtn"),
  adminStatus: document.getElementById("adminStatus"),
};

const sourceContent = normalizeContent(window.VINHYA_CONTENT || {});
let content = loadDraft() || clone(sourceContent);

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function normalizeContent(value) {
  return {
    services: Array.isArray(value.services) ? value.services : [],
    reviews: Array.isArray(value.reviews) ? value.reviews : [],
    clients: Array.isArray(value.clients) ? value.clients : [],
  };
}

function loadDraft() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalizeContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

function saveDraft(message = "Draft saved locally.") {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  setStatus(message);
}

function setStatus(message) {
  if (els.adminStatus) {
    els.adminStatus.textContent = message;
  }
}

function starsMarkup(rating) {
  const safeRating = Math.max(1, Math.min(5, Number(rating) || 5));
  return Array.from({ length: safeRating }, () => '<i class="fas fa-star"></i>').join("");
}

function render() {
  renderServices();
  renderReviews();
  renderClients();
  els.serviceCount.textContent = String(content.services.length);
  els.reviewCount.textContent = String(content.reviews.length);
  els.clientCount.textContent = String(content.clients.length);
}

function renderServices() {
  els.serviceList.innerHTML = content.services.length
    ? content.services
        .map(
          (item, index) => `
            <article class="admin-item">
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <p class="admin-item-kicker mb-1">Service ${index + 1}</p>
                  <h3 class="admin-item-title mb-2">${escapeHtml(item.title || "")}</h3>
                  <p class="admin-item-meta mb-1"><i class="${escapeHtml(item.icon || "")} me-2"></i>${escapeHtml(item.icon || "")}</p>
                </div>
                <span class="admin-pill">Card</span>
              </div>
              <p class="admin-item-copy mb-3">${escapeHtml(item.desc || "")}</p>
              <div class="admin-item-actions">
                <button class="btn btn-sm btn-outline-primary" type="button" data-action="edit-service" data-index="${index}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete-service" data-index="${index}">Delete</button>
              </div>
            </article>
          `
        )
        .join("")
    : '<p class="text-muted mb-0">No services yet.</p>';
}

function renderReviews() {
  els.reviewList.innerHTML = content.reviews.length
    ? content.reviews
        .map(
          (item, index) => `
            <article class="admin-item">
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="admin-avatar">${escapeHtml(item.initials || "")}</div>
                  <div>
                    <p class="admin-item-kicker mb-1">Review ${index + 1}</p>
                    <h3 class="admin-item-title mb-1">${escapeHtml(item.name || "")}</h3>
                    <p class="admin-item-meta mb-0">${escapeHtml(item.service || "")}</p>
                  </div>
                </div>
                <span class="admin-pill">${Number(item.rating) || 5} stars</span>
              </div>
              <div class="admin-stars mt-3">${starsMarkup(item.rating)}</div>
              <p class="admin-item-copy mb-3 mt-3">${escapeHtml(item.desc || "")}</p>
              <div class="admin-item-actions">
                <button class="btn btn-sm btn-outline-primary" type="button" data-action="edit-review" data-index="${index}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete-review" data-index="${index}">Delete</button>
              </div>
            </article>
          `
        )
        .join("")
    : '<p class="text-muted mb-0">No reviews yet.</p>';
}

function renderClients() {
  els.clientList.innerHTML = content.clients.length
    ? content.clients
        .map(
          (item, index) => `
            <article class="admin-item">
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="admin-client-logo">${clientLogoMarkup(item)}</div>
                  <div>
                    <p class="admin-item-kicker mb-1">Client ${index + 1}</p>
                    <h3 class="admin-item-title mb-1">${escapeHtml(item.name || "")}</h3>
                    <p class="admin-item-meta mb-0">${escapeHtml(item.logo || "No logo path")}</p>
                  </div>
                </div>
                <span class="admin-pill">Logo</span>
              </div>
              <div class="admin-item-actions mt-3">
                <button class="btn btn-sm btn-outline-primary" type="button" data-action="edit-client" data-index="${index}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" type="button" data-action="delete-client" data-index="${index}">Delete</button>
              </div>
            </article>
          `
        )
        .join("")
    : '<p class="text-muted mb-0">No clients yet.</p>';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function safeImageSource(value) {
  const source = String(value || "").trim();

  if (/^(https?:)?\/\//i.test(source) || /^images\//i.test(source) || /^\.{0,2}\//.test(source)) {
    return source.replaceAll('"', "%22");
  }

  if (/^[a-z0-9][a-z0-9._\-\s/]*\.(png|jpe?g|webp|gif|svg)$/i.test(source)) {
    return `../images/${source}`.replaceAll('"', "%22");
  }

  return "";
}

function clientLogoMarkup(item) {
  const logo = safeImageSource(item.logo);
  const name = escapeHtml(item.name || "Client");

  if (logo) {
    return `<img src="${logo}" alt="${name} logo" loading="lazy" decoding="async">`;
  }

  return `<span>${escapeHtml(initialsFromName(item.name))}</span>`;
}

function initialsFromName(name) {
  return String(name || "Client")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function clearServiceForm() {
  els.serviceEditIndex.value = "";
  els.serviceTitle.value = "";
  els.serviceIcon.value = "";
  els.serviceDesc.value = "";
  els.serviceEditingLabel.textContent = "Adding a new service";
  els.serviceSubmitBtn.textContent = "Add service";
  els.serviceForm.classList.remove("is-editing");
}

function clearReviewForm() {
  els.reviewEditIndex.value = "";
  els.reviewInitials.value = "";
  els.reviewName.value = "";
  els.reviewService.value = "";
  els.reviewRating.value = "5";
  els.reviewDesc.value = "";
  els.reviewEditingLabel.textContent = "Adding a new review";
  els.reviewSubmitBtn.textContent = "Add review";
  els.reviewForm.classList.remove("is-editing");
}

function clearClientForm() {
  els.clientEditIndex.value = "";
  els.clientName.value = "";
  els.clientLogo.value = "";
  els.clientEditingLabel.textContent = "Adding a new client";
  els.clientSubmitBtn.textContent = "Add client";
  els.clientForm.classList.remove("is-editing");
}

function fillServiceForm(item, index) {
  els.serviceEditIndex.value = String(index);
  els.serviceTitle.value = item.title || "";
  els.serviceIcon.value = item.icon || "";
  els.serviceDesc.value = item.desc || "";
  els.serviceEditingLabel.textContent = `Editing service ${index + 1}`;
  els.serviceSubmitBtn.textContent = "Update service";
  els.serviceForm.classList.add("is-editing");
  els.serviceForm.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => els.serviceTitle.focus(), 350);
  setStatus(`Editing service ${index + 1}. Change the fields, then press Update service.`);
}

function fillReviewForm(item, index) {
  els.reviewEditIndex.value = String(index);
  els.reviewInitials.value = item.initials || "";
  els.reviewName.value = item.name || "";
  els.reviewService.value = item.service || "";
  els.reviewRating.value = String(item.rating || 5);
  els.reviewDesc.value = item.desc || "";
  els.reviewEditingLabel.textContent = `Editing review ${index + 1}`;
  els.reviewSubmitBtn.textContent = "Update review";
  els.reviewForm.classList.add("is-editing");
  els.reviewForm.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => els.reviewName.focus(), 350);
  setStatus(`Editing review ${index + 1}. Change the fields, then press Update review.`);
}

function fillClientForm(item, index) {
  els.clientEditIndex.value = String(index);
  els.clientName.value = item.name || "";
  els.clientLogo.value = item.logo || "";
  els.clientEditingLabel.textContent = `Editing client ${index + 1}`;
  els.clientSubmitBtn.textContent = "Update client";
  els.clientForm.classList.add("is-editing");
  els.clientForm.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => els.clientName.focus(), 350);
  setStatus(`Editing client ${index + 1}. Change the fields, then press Update client.`);
}

function addOrUpdateService(event) {
  event.preventDefault();
  const index = els.serviceEditIndex.value === "" ? -1 : Number(els.serviceEditIndex.value);
  const entry = {
    title: els.serviceTitle.value.trim(),
    icon: els.serviceIcon.value.trim(),
    desc: els.serviceDesc.value.trim(),
  };

  let message = "";

  if (index >= 0) {
    content.services[index] = entry;
    message = `Updated service ${index + 1}. Preview the site to check the layout.`;
  } else {
    content.services.push(entry);
    message = "Added new service. Preview the site to check the layout.";
  }

  clearServiceForm();
  saveDraft(message);
  render();
}

function addOrUpdateReview(event) {
  event.preventDefault();
  const index = els.reviewEditIndex.value === "" ? -1 : Number(els.reviewEditIndex.value);
  const entry = {
    initials: els.reviewInitials.value.trim().toUpperCase(),
    name: els.reviewName.value.trim(),
    service: els.reviewService.value.trim(),
    rating: Math.max(1, Math.min(5, Number(els.reviewRating.value) || 5)),
    desc: els.reviewDesc.value.trim(),
  };

  let message = "";

  if (index >= 0) {
    content.reviews[index] = entry;
    message = `Updated review ${index + 1}. Preview the site to check the layout.`;
  } else {
    content.reviews.push(entry);
    message = "Added new review. Preview the site to check the layout.";
  }

  clearReviewForm();
  saveDraft(message);
  render();
}

function addOrUpdateClient(event) {
  event.preventDefault();
  const index = els.clientEditIndex.value === "" ? -1 : Number(els.clientEditIndex.value);
  const entry = {
    name: els.clientName.value.trim(),
    logo: els.clientLogo.value.trim(),
  };

  let message = "";

  if (index >= 0) {
    content.clients[index] = entry;
    message = `Updated client ${index + 1}. Preview the site to check the layout.`;
  } else {
    content.clients.push(entry);
    message = "Added new client. Preview the site to check the layout.";
  }

  clearClientForm();
  saveDraft(message);
  render();
}

function handleListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const index = Number(button.dataset.index);
  const action = button.dataset.action;

  if (action === "edit-service") {
    fillServiceForm(content.services[index], index);
  }

  if (action === "delete-service") {
    if (window.confirm("Delete this service card?")) {
      content.services.splice(index, 1);
      saveDraft("Service deleted. Preview the site to check the layout.");
      render();
      clearServiceForm();
    }
  }

  if (action === "edit-review") {
    fillReviewForm(content.reviews[index], index);
  }

  if (action === "delete-review") {
    if (window.confirm("Delete this review?")) {
      content.reviews.splice(index, 1);
      saveDraft("Review deleted. Preview the site to check the layout.");
      render();
      clearReviewForm();
    }
  }

  if (action === "edit-client") {
    fillClientForm(content.clients[index], index);
  }

  if (action === "delete-client") {
    if (window.confirm("Delete this client?")) {
      content.clients.splice(index, 1);
      saveDraft("Client deleted. Preview the site to check the layout.");
      render();
      clearClientForm();
    }
  }
}

function downloadFile(filename, body, mimeType) {
  const blob = new Blob([body], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function exportJson() {
  downloadFile("content-data.json", JSON.stringify(content, null, 2), "application/json");
  setStatus("Downloaded JSON.");
}

function exportJs() {
  const body = `window.VINHYA_CONTENT = ${JSON.stringify(content, null, 2)};\n`;
  downloadFile("content-data.js", body, "application/javascript");
  setStatus("Downloaded content-data.js.");
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setStatus("Copied JSON to clipboard.");
  } catch {
    setStatus("Copy failed. Use Download JSON instead.");
  }
}

async function importFile(file) {
  const text = await file.text();
  let imported = null;

  if (file.name.toLowerCase().endsWith(".json")) {
    imported = JSON.parse(text);
  } else {
    const sandboxWindow = {};

    try {
      Function("window", `${text}; return window.VINHYA_CONTENT;`)(sandboxWindow);
      imported = sandboxWindow.VINHYA_CONTENT;
    } catch {
      throw new Error("Could not read the JS file.");
    }
  }

  content = normalizeContent(imported);
  saveDraft(`Imported ${file.name}. Preview the site to check the layout.`);
  render();
  clearServiceForm();
  clearReviewForm();
  clearClientForm();
}

function resetDraft() {
  if (!window.confirm("Reset the local draft back to the bundled content?")) {
    return;
  }

  content = clone(sourceContent);
  localStorage.removeItem(STORAGE_KEY);
  clearServiceForm();
  clearReviewForm();
  clearClientForm();
  render();
  setStatus("Draft reset to the bundled content.");
}

document.addEventListener("DOMContentLoaded", () => {
  render();
  clearServiceForm();
  clearReviewForm();
  clearClientForm();

  els.serviceForm.addEventListener("submit", addOrUpdateService);
  els.reviewForm.addEventListener("submit", addOrUpdateReview);
  els.clientForm.addEventListener("submit", addOrUpdateClient);
  els.serviceCancelBtn.addEventListener("click", clearServiceForm);
  els.reviewCancelBtn.addEventListener("click", clearReviewForm);
  els.clientCancelBtn.addEventListener("click", clearClientForm);
  els.serviceList.addEventListener("click", handleListClick);
  els.reviewList.addEventListener("click", handleListClick);
  els.clientList.addEventListener("click", handleListClick);
  els.downloadJsonBtn.addEventListener("click", exportJson);
  els.downloadJsBtn.addEventListener("click", exportJs);
  els.copyJsonBtn.addEventListener("click", copyJson);
  els.resetBtn.addEventListener("click", resetDraft);
  els.importFileInput.addEventListener("change", async () => {
    const [file] = els.importFileInput.files || [];
    if (!file) return;

    try {
      await importFile(file);
    } catch (error) {
      console.error(error);
      setStatus(error.message || "Import failed.");
    } finally {
      els.importFileInput.value = "";
    }
  });
});

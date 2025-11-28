// -------------------------------
// GLOBAL SETTINGS
// -------------------------------
const clinicPhone = "+998901234567";
let currentLang = localStorage.getItem("lang") || "en";

// -------------------------------
// LANGUAGE DROPDOWN
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const langSelect = document.getElementById("language-select");

  if (langSelect) {
    langSelect.value = currentLang;
    langSelect.addEventListener("change", function () {
      setLanguage(this.value);
    });
  }

  setLanguage(currentLang);
});

// -------------------------------
// SET LANGUAGE
// -------------------------------
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);

  updateStaticText();
  updateDynamicSections();
}

// -------------------------------
// UPDATE STATIC TEXT
// -------------------------------
function updateStaticText() {
  document.querySelectorAll("[data-key]").forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });

  // Section titles
  document.querySelector("#about h2").textContent =
    translations[currentLang].about_title;
  document.querySelector("#services h2").textContent =
    translations[currentLang].services_title;
  document.querySelector("#news h2").textContent =
    translations[currentLang].news_title;
  document.querySelector("#location h2").textContent =
    translations[currentLang].location_title;

  document.getElementById("about-text").textContent =
    translations[currentLang].about_text;
}

// -------------------------------
// UPDATE SERVICES & NEWS
// -------------------------------
function updateDynamicSections() {
  loadServices();
  loadNews();
}

// -------------------------------
// LOAD NEWS
// -------------------------------
function loadNews() {
  fetch("news.json")
    .then((res) => res.json())
    .then((data) => {
      const section = document.getElementById("news");
      const container = document.getElementById("news-container");
      container.innerHTML = "";

      if (!data || data.length === 0) {
        section.style.display = "none";
        return;
      }

      section.style.display = "block";

      data.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("news-card");

        card.innerHTML = `
          <h3>${item.title[currentLang]}</h3>
          <p>${item.description[currentLang]}</p>
          <small>${item.date}</small>
        `;

        container.appendChild(card);
      });
    })
    .catch(() => {
      document.getElementById("news").style.display = "none";
    });
}

// -------------------------------
// LOAD SERVICES
// -------------------------------
function loadServices() {
  fetch("services.json")
    .then((res) => res.json())
    .then((data) => {
      const container = document.getElementById("services-container");
      container.innerHTML = "";

      data.forEach((service) => {
        const card = document.createElement("div");
        card.classList.add("service");

        card.innerHTML = `
          <h3>${service.name[currentLang]}</h3>
          <p>${service.shortDesc[currentLang]}</p>
          <div class="buttons">
          <button class="details-btn">${translations[currentLang].more_details}</button>
          <a href="tel:${clinicPhone}" class="call-btn">${translations[currentLang].call_btn}</a>
          </div>
          `;

        // Add modal functionality
        card.querySelector(".details-btn").addEventListener("click", () => {
          showServiceModal(service);
        });

        container.appendChild(card);
      });
    })
    .catch((err) => console.error("Error loading services:", err));
}

// -------------------------------
// SERVICE MODAL
// -------------------------------
function showServiceModal(service) {
  document.body.style.overflow = "hidden";

  const modal = document.createElement("div");
  modal.classList.add("modal");

  const imageHTML = service.image
    ? `<img src="${service.image}" alt="${service.name[currentLang]}" class="service-img-modal">`
    : "";

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <h2>${service.name[currentLang]}</h2>
      ${imageHTML}
      <p>${service.shortDesc[currentLang]}</p>
      <ul>
        ${service.details[currentLang]
          .map((item) => `<li>${item}</li>`)
          .join("")}
      </ul>
      <p><strong>${translations[currentLang].doctor}:</strong> ${
    service.doctor[currentLang]
  }</p>
      <p><strong>${translations[currentLang].hours}:</strong> ${
    service.hours
  }</p>
      <a href="tel:${clinicPhone}" class="call-btn">${
    translations[currentLang].call_btn
  }</a>
    </div>
  `;

  document.body.appendChild(modal);

  modal
    .querySelector(".close")
    .addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
}

function closeModal(modal) {
  modal.remove();
  document.body.style.overflow = "auto";
}

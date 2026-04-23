(function () {
  // ── Hamburger / Mobile Menu ──────────────────────────────────────
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");
  var overlay = document.getElementById("mobile-overlay");
  var mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-cta");

  function openMenu() {
    mobileMenu.classList.add("open");
    overlay.classList.add("show");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", function () {
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  // ── Active nav link on scroll ────────────────────────────────────
  var sections = ["hero", "stats", "problem", "solution", "result", "contact"];
  var allNavLinks = document.querySelectorAll(".nav-link");

  function updateActiveLink() {
    var scrollY = window.pageYOffset + 120;
    var current = "hero";

    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) current = id;
    });

    allNavLinks.forEach(function (a) {
      var sec = a.getAttribute("data-section");
      a.classList.toggle("active", sec === current);
    });
  }

  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  // ── Smooth scroll for anchor links ───────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ── Contact form validation & submission ─────────────────────────
  var isEnglish = document.documentElement.lang === "en";
  var i18n = isEnglish
    ? {
        brand: "Please enter the brand name",
        brandMin: "Brand name must be at least 2 characters",
        brandMax: "Brand name must not exceed 50 characters",
        manager: "Please enter the manager name",
        managerMin: "Manager name must be at least 2 characters",
        managerNoNumbers: "Manager name must not contain numbers",
        managerMax: "Manager name must not exceed 50 characters",
        email: "Please enter your email",
        emailInvalid: "Please enter a valid email",
        sector: "Please enter your industry",
        sectorMax: "Industry must not exceed 50 characters",
        city: "Please enter your city",
        cityMax: "City must not exceed 50 characters",
        messageMax: "Message must not exceed 500 characters",
        sending: "Sending...",
        send: "Send",
      }
    : {
        brand: "يرجى إدخال اسم العلامة التجارية",
        brandMin: "يجب أن يكون اسم العلامة التجارية حرفين على الأقل",
        brandMax: "يجب ألا يتجاوز اسم العلامة التجارية 50 حرفاً",
        manager: "يرجى إدخال اسم المسؤول",
        managerMin: "يجب أن يكون اسم المسؤول حرفين على الأقل",
        managerNoNumbers: "يجب ألا يحتوي اسم المسؤول على أرقام",
        managerMax: "يجب ألا يتجاوز اسم المسؤول 50 حرفاً",
        email: "يرجى إدخال البريد الإلكتروني",
        emailInvalid: "البريد الإلكتروني غير صحيح",
        sector: "يرجى إدخال القطاع",
        sectorMax: "يجب ألا يتجاوز القطاع 50 حرفاً",
        city: "يرجى إدخال المدينة",
        cityMax: "يجب ألا تتجاوز المدينة 50 حرفاً",
        messageMax: "يجب ألا تتجاوز الرسالة 500 حرف",
        sending: "جارٍ الإرسال...",
        send: "إرسال",
      };

  var form = document.getElementById("contact-form");
  var submitBtn = document.getElementById("submit-btn");
  var successEl = document.getElementById("form-success");

  function showError(id, msg) {
    var el = document.getElementById(id + "-error");
    if (el) {
      el.textContent = msg;
      el.style.display = "block";
    }
    var input = document.getElementById(id);
    if (input) input.classList.add("input-error");
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(function (e) {
      e.textContent = "";
      e.style.display = "none";
    });
    document
      .querySelectorAll(".real-input, .real-textarea")
      .forEach(function (i) {
        i.classList.remove("input-error");
      });
  }

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function hasDigits(val) {
    return /\d/.test(val);
  }

  // Cache problem-section images to avoid first-click white flash.
  var panelImageCache = {};

  function preloadImage(src) {
    if (!src) return Promise.resolve();

    if (panelImageCache[src] === "loaded") {
      return Promise.resolve();
    }

    if (panelImageCache[src] && typeof panelImageCache[src].then === "function") {
      return panelImageCache[src];
    }

    panelImageCache[src] = new Promise(function (resolve) {
      var img = new Image();

      img.onload = function () {
        panelImageCache[src] = "loaded";
        resolve();
      };

      img.onerror = function () {
        panelImageCache[src] = "error";
        resolve();
      };

      img.src = src;
    });

    return panelImageCache[src];
  }

  function preloadProblemPanelImages() {
    var imageMap = {};

    document.querySelectorAll(".problem-panel").forEach(function (panel) {
      if (panel.dataset.shrinked) imageMap[panel.dataset.shrinked] = true;
      if (panel.dataset.expanded) imageMap[panel.dataset.expanded] = true;
    });

    Object.keys(imageMap).forEach(function (src) {
      preloadImage(src);
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      clearErrors();
      successEl.style.display = "none";

      var brand = document.getElementById("brand").value.trim();
      var manager = document.getElementById("manager").value.trim();
      var email = document.getElementById("email").value.trim();
      var sector = document.getElementById("sector").value.trim();
      var city = document.getElementById("city").value.trim();
      var message = document.getElementById("message").value;

      var valid = true;

      if (!brand) {
        showError("brand", i18n.brand);
        valid = false;
      } else if (brand.length < 2) {
        showError("brand", i18n.brandMin);
        valid = false;
      } else if (brand.length > 50) {
        showError("brand", i18n.brandMax);
        valid = false;
      }
      if (!manager) {
        showError("manager", i18n.manager);
        valid = false;
      } else if (manager.length < 2) {
        showError("manager", i18n.managerMin);
        valid = false;
      } else if (hasDigits(manager)) {
        showError("manager", i18n.managerNoNumbers);
        valid = false;
      } else if (manager.length > 50) {
        showError("manager", i18n.managerMax);
        valid = false;
      }
      if (!email) {
        showError("email", i18n.email);
        valid = false;
      } else if (!validateEmail(email)) {
        showError("email", i18n.emailInvalid);
        valid = false;
      }
      if (!sector) {
        showError("sector", i18n.sector);
        valid = false;
      } else if (sector.length > 50) {
        showError("sector", i18n.sectorMax);
        valid = false;
      }
      if (!city) {
        showError("city", i18n.city);
        valid = false;
      } else if (city.length > 50) {
        showError("city", i18n.cityMax);
        valid = false;
      }

      if (message.length > 500) {
        showError("message", i18n.messageMax);
        valid = false;
      }

      if (!valid) return;

      submitBtn.disabled = true;
      document.getElementById("submit-label").textContent = i18n.sending;

      setTimeout(function () {
        form.reset();
        submitBtn.disabled = false;
        document.getElementById("submit-label").textContent = i18n.send;
        successEl.style.display = "block";
        successEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 1200);
    });

    // Live input error clearing
    form
      .querySelectorAll(".real-input, .real-textarea")
      .forEach(function (inp) {
        inp.addEventListener("input", function () {
          if (this.id === "manager" && hasDigits(this.value)) {
            this.value = this.value.replace(/\d+/g, "");
          }

          this.classList.remove("input-error");
          var errId = this.id + "-error";
          var errEl = document.getElementById(errId);
          if (errEl) {
            errEl.textContent = "";
            errEl.style.display = "none";
          }
        });
      });

    // Problem accordion
    preloadProblemPanelImages();

    document.querySelectorAll(".problem-panel").forEach(function (panel) {
      panel.addEventListener("click", function () {
        preloadImage(panel.dataset.expanded).then(function () {
          document.querySelectorAll(".problem-panel").forEach(function (p) {
            p.classList.remove("active");
            p.style.backgroundImage = "url('" + p.dataset.shrinked + "')";
          });

          panel.classList.add("active");
          panel.style.backgroundImage =
            "url('" + panel.dataset.expanded + "')";
        });
      });
    });
  }
})();

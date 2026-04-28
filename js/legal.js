(function () {
  var hamburger = document.getElementById("hamburger");
  var mobileMenu = document.getElementById("mobile-menu");
  var overlay = document.getElementById("mobile-overlay");
  var header = document.querySelector(".site-header");
  var mobileLinks = document.querySelectorAll(".mobile-nav-link, .mobile-cta");

  function syncHeaderPosition() {
    if (!header) return;
    header.classList.toggle("scrolled", window.pageYOffset > 40);
  }

  function setupRevealAnimation(elements) {
    if (!elements.length) return;

    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.classList.add("is-visible");
      });
      return;
    }

    elements.forEach(function (element) {
      element.classList.add("motion-reveal", "is-reveal-ready");
    });

    var observer = new IntersectionObserver(
      function (entries, currentObserver) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -48px 0px",
      }
    );

    elements.forEach(function (element, index) {
      element.style.transitionDelay = index % 3 * 70 + "ms";
      observer.observe(element);
    });
  }

  function openMenu() {
    mobileMenu.classList.add("open");
    overlay.classList.add("show");
    if (header) header.classList.add("menu-open");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    overlay.classList.remove("show");
    if (header) header.classList.remove("menu-open");
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

  setupRevealAnimation(
    Array.from(
      document.querySelectorAll(
        ".legal-hero-card, .privacy-section, .privacy-toc-card, .legal-footer-chip"
      )
    )
  );

  // ── Privacy/Terms TOC active state + bar intensity ───────────────
  var tocLinks = Array.from(
    document.querySelectorAll(".privacy-toc-card .legal-links-list a")
  );
  var tocBars = document.querySelector(".privacy-toc-bars");
  var sections = tocLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function ensureBarsCount() {
    if (!tocBars) return [];
    tocBars.innerHTML = "";
    return tocLinks.map(function () {
      var bar = document.createElement("span");
      tocBars.appendChild(bar);
      return bar;
    });
  }

  var bars = ensureBarsCount();
  var clickPriorityIndex = null;
  var clickPriorityTargetY = null;
  var clickPriorityUntil = 0;

  function setActive(index) {
    tocLinks.forEach(function (link, i) {
      link.classList.toggle("active", i === index);
    });

    bars.forEach(function (bar, i) {
      var distance = Math.abs(i - index);
      bar.classList.remove("is-active", "is-near");

      if (distance === 0) {
        bar.classList.add("is-active");
      } else if (distance === 1) {
        bar.classList.add("is-near");
      }
    });
  }

  function getHeaderOffset() {
    var h = document.querySelector(".site-header");
    var headerHeight = h ? h.offsetHeight : 0;
    return headerHeight + 24;
  }

  function currentSectionIndex() {
    if (!sections.length) return 0;

    var activationLine = 88;
    var offset = getHeaderOffset();
    var activeIndex = 0;

    for (var idx = 0; idx < sections.length; idx++) {
      var topRelativeToHeader =
        sections[idx].getBoundingClientRect().top - offset;

      if (topRelativeToHeader <= activationLine) {
        activeIndex = idx;
      } else {
        break;
      }
    }

    return activeIndex;
  }

  function hasReachedSection(index) {
    var section = sections[index];
    if (!section) return true;

    var activationLine = 88;
    var offset = getHeaderOffset();
    var topRelativeToHeader = section.getBoundingClientRect().top - offset;
    return topRelativeToHeader <= activationLine;
  }

  function shouldKeepClickPriority() {
    if (clickPriorityIndex === null) return false;

    var now = Date.now();
    if (now > clickPriorityUntil) return false;
    if (hasReachedSection(clickPriorityIndex)) return false;

    return true;
  }

  function updateActiveFromScroll() {
    if (shouldKeepClickPriority()) {
      setActive(clickPriorityIndex);
      return;
    }

    clickPriorityIndex = null;
    clickPriorityTargetY = null;
    clickPriorityUntil = 0;
    setActive(currentSectionIndex());
  }

  tocLinks.forEach(function (link, idx) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var target = sections[idx];
      if (!target) return;

      var fixedOffset = getHeaderOffset();
      var y =
        target.getBoundingClientRect().top + window.pageYOffset - fixedOffset;

      clickPriorityIndex = idx;
      clickPriorityTargetY = y;
      clickPriorityUntil = Date.now() + 2200;
      setActive(idx);

      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  window.addEventListener(
    "scroll",
    function () {
      syncHeaderPosition();
      updateActiveFromScroll();
    },
    { passive: true }
  );

  window.addEventListener("resize", function () {
    syncHeaderPosition();
    updateActiveFromScroll();
  });

  window.addEventListener("load", function () {
    syncHeaderPosition();
    updateActiveFromScroll();
  });

  syncHeaderPosition();
  updateActiveFromScroll();
})();

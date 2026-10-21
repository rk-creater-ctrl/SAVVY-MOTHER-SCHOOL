document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     PRELOADER (Only once per visitor session)
  ========================================================= */

  const preloader = document.querySelector(".preloader");
  const hasVisited = sessionStorage.getItem("smis_visited");

  if (preloader) {
    if (hasVisited) {
      preloader.remove();
    } else {
      sessionStorage.setItem("smis_visited", "true");
      const hidePreloader = () => {
        if (!preloader.classList.contains("hide")) {
          preloader.classList.add("hide");
          setTimeout(() => {
            if (preloader && preloader.parentNode) {
              preloader.parentNode.removeChild(preloader);
            }
          }, 800);
        }
      };

      if (document.readyState === "complete") {
        setTimeout(hidePreloader, 350);
      } else {
        window.addEventListener("load", () => setTimeout(hidePreloader, 350), { once: true });
        // Fallback safety: guarantee preloader dismissal after 1.2s max
        setTimeout(hidePreloader, 1200);
      }
    }
  } else {
    sessionStorage.setItem("smis_visited", "true");
  }

  /* =========================================================
     HEADER SCROLL
  ========================================================= */

  const header = document.querySelector(".header");

  const updateHeader = () => {
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader);

  /* =========================================================
     MOBILE MENU AND DROPDOWNS
  ========================================================= */

  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".nav");
  const dropdowns = document.querySelectorAll(".nav-dropdown");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("active");

      menuButton.textContent = isOpen ? "✕" : "☰";
      menuButton.setAttribute("aria-expanded", String(isOpen));
    });
  }

  dropdowns.forEach((dropdown) => {
    const dropdownButton = dropdown.querySelector(".nav-dropdown-toggle");

    if (!dropdownButton) return;

    dropdownButton.addEventListener("click", (event) => {
      if (window.innerWidth <= 1000) {
        event.preventDefault();

        dropdowns.forEach((item) => {
          if (item !== dropdown) {
            item.classList.remove("active");
          }
        });

        dropdown.classList.toggle("active");
      }
    });
  });

  document.addEventListener("click", (event) => {
    if (window.innerWidth > 1000) return;

    const clickedNavigation = navigation && navigation.contains(event.target);
    const clickedMenuButton = menuButton && menuButton.contains(event.target);

    if (!clickedNavigation && !clickedMenuButton) {
      if (navigation) {
        navigation.classList.remove("active");
      }

      if (menuButton) {
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
      }
    }
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 1000 && navigation && menuButton) {
        navigation.classList.remove("active");
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) {
      if (navigation) {
        navigation.classList.remove("active");
      }

      if (menuButton) {
        menuButton.textContent = "☰";
        menuButton.setAttribute("aria-expanded", "false");
      }

      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  });

  /* =========================================================
     HERO SLIDER
  ========================================================= */

  const heroSlides = [...document.querySelectorAll(".hero-slide")];
  const heroBars = [...document.querySelectorAll(".slider-bar")];

  const heroTitle = document.getElementById("heroTitle");
  const heroDescription = document.getElementById("heroDescription");

  const heroNext = document.getElementById("heroNext");
  const heroPrev = document.getElementById("heroPrev");

  let heroCurrent = 0;
  let heroTimer;

  function showHeroSlide(index) {
    if (
      !heroSlides.length ||
      !heroBars.length ||
      !heroTitle ||
      !heroDescription
    ) {
      return;
    }

    heroCurrent = index;

    heroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === index);
    });

    heroBars.forEach((bar, barIndex) => {
      bar.classList.toggle("active", barIndex === index);
    });

    const activeSlide = heroSlides[index];

    heroTitle.style.opacity = "0";
    heroDescription.style.opacity = "0";

    setTimeout(() => {
      heroTitle.innerHTML = activeSlide.dataset.title || "";
      heroDescription.textContent = activeSlide.dataset.description || "";

      heroTitle.style.opacity = "1";
      heroDescription.style.opacity = "1";
    }, 250);

    clearInterval(heroTimer);

    heroTimer = setInterval(() => {
      showHeroSlide((heroCurrent + 1) % heroSlides.length);
    }, 5000);
  }

  if (heroSlides.length) {
    showHeroSlide(0);
  }

  if (heroNext) {
    heroNext.addEventListener("click", () => {
      showHeroSlide((heroCurrent + 1) % heroSlides.length);
    });
  }

  if (heroPrev) {
    heroPrev.addEventListener("click", () => {
      showHeroSlide(
        (heroCurrent - 1 + heroSlides.length) % heroSlides.length
      );
    });
  }

  heroBars.forEach((bar) => {
    bar.addEventListener("click", () => {
      showHeroSlide(Number(bar.dataset.slide));
    });
  });

  /* =========================================================
     COUNTERS
  ========================================================= */

  const countElements = document.querySelectorAll("[data-count]");

  if (countElements.length) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          const target = Number(element.dataset.count);
          const suffix = element.dataset.suffix || "";
          const prefix = element.dataset.prefix || "";

          let startTime = null;

          function animateCounter(timestamp) {
            if (!startTime) {
              startTime = timestamp;
            }

            const progress = Math.min(
              (timestamp - startTime) / 1300,
              1
            );

            const ease = 1 - Math.pow(1 - progress, 3);

            const value = Math.floor(target * ease);

            element.textContent = prefix + value.toLocaleString() + suffix;

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              element.textContent = prefix + target.toLocaleString() + suffix;
            }
          }

          requestAnimationFrame(animateCounter);

          observer.unobserve(element);
        });
      },
      {
        threshold: 0.65
      }
    );

    countElements.forEach((element) => {
      counterObserver.observe(element);
    });
  }

  /* =========================================================
     REVEAL ANIMATIONS
  ========================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px 80px 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });

    // Fallback safety: ensure all elements are visible after 1.5s
    setTimeout(() => {
      revealElements.forEach((element) => {
        element.classList.add("show");
      });
    }, 1500);
  }

  /* =========================================================
     NEWS DOTS
  ========================================================= */

  const newsDots = document.querySelectorAll(".news-dots span");
  const newsNext = document.getElementById("newsNext");
  const newsPrev = document.getElementById("newsPrev");

  let newsCurrent = 0;

  function changeNewsDot(index) {
    if (!newsDots.length) return;

    newsCurrent = index;

    newsDots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === index);
    });
  }

  if (newsNext && newsDots.length) {
    newsNext.addEventListener("click", () => {
      changeNewsDot((newsCurrent + 1) % newsDots.length);
    });
  }

  if (newsPrev && newsDots.length) {
    newsPrev.addEventListener("click", () => {
      changeNewsDot(
        (newsCurrent - 1 + newsDots.length) % newsDots.length
      );
    });
  }

  /* =========================================================
     INSTANT SITE SEARCH (CTRL + K QUICK FINDER)
  ========================================================= */

  const path = ((typeof window !== 'undefined' && window.location && (window.location.pathname || window.location.href)) || '').replace(/\\/g, '/');
  const isSubfolder = path.indexOf('/about/') !== -1 || 
                      path.indexOf('/academics/') !== -1 || 
                      path.indexOf('/admissions/') !== -1 || 
                      path.indexOf('/events/') !== -1;
  const root = isSubfolder ? '../' : '';

  const siteSearchIndex = [
    { title: "Home Page", desc: "Welcome to Savvy Mother International School, Rewa", url: root + "index.html", badge: "General", class: "badge-general" },
    { title: "Fee Structure & Transport Estimator", desc: "Grade-wise fee table, installments, bus fee calculator and payment options", url: root + "fee-structure.html", badge: "Fees", class: "badge-admissions" },
    { title: "Online Admission Application Form", desc: "Apply online for Nursery to Class XII for Academic Session 2026-27", url: root + "admission-form.html", badge: "Admissions", class: "badge-admissions" },
    { title: "Admission Process & Guidelines", desc: "Step-by-step admission timeline, registration, counseling and documentation", url: root + "admissions/process.html", badge: "Admissions", class: "badge-admissions" },
    { title: "Eligibility & Age Criteria", desc: "Age requirements per grade, required documents and cut-off dates", url: root + "admissions/eligibility.html", badge: "Admissions", class: "badge-admissions" },
    { title: "Online Inquiry & Campus Tour", desc: "Submit an inquiry or schedule a guided campus tour with our counselors", url: root + "admissions/inquiry.html", badge: "Admissions", class: "badge-admissions" },
    { title: "Notice Board & Downloads Portal", desc: "Official school circulars, exam date-sheets, academic calendar & printable forms", url: root + "downloads.html", badge: "Notices", class: "badge-general" },
    { title: "Filterable Photo Gallery", desc: "Campus photography, events, robotics labs, sports day and celebrations", url: root + "gallery.html", badge: "Campus", class: "badge-facilities" },
    { title: "Our School & Philosophy", desc: "History, vision, Sri Aurobindo five-fold education and values", url: root + "about/school.html", badge: "About", class: "badge-about" },
    { title: "Campus & Infrastructure", desc: "Smart classrooms, lush grounds, secure campus and modern architecture", url: root + "about/campus.html", badge: "About", class: "badge-about" },
    { title: "Faculty & Academic Mentors", desc: "Qualified educators, student-teacher ratio 1:30 and specialized staff", url: root + "about/faculty.html", badge: "About", class: "badge-about" },
    { title: "Director's Message", desc: "Dr. Sujay Singh on holistic education, AI and character building", url: root + "about/director.html", badge: "Leadership", class: "badge-about" },
    { title: "Principal's Message", desc: "Ajeet Singh on academic excellence, discipline and future readiness", url: root + "about/principal.html", badge: "Leadership", class: "badge-about" },
    { title: "Headmistress's Message", desc: "Anupma Mishra on early childhood nurturing and emotional intelligence", url: root + "about/headmistress.html", badge: "Leadership", class: "badge-about" },
    { title: "Pre-Primary / Toddler Wing", desc: "Playgroup, Nursery, Kindergarten with experiential learning and abacus", url: root + "academics/pre-primary.html", badge: "Academics", class: "badge-academics" },
    { title: "Middle School (Classes VI-VIII)", desc: "Foundational STEM, Data Science & AI intro, languages and arts", url: root + "academics/middle.html", badge: "Academics", class: "badge-academics" },
    { title: "Secondary School (Classes IX-X)", desc: "CBSE board readiness, laboratories, coding and Olympiads", url: root + "academics/secondary.html", badge: "Academics", class: "badge-academics" },
    { title: "Senior Secondary (Classes XI-XII)", desc: "Science, Commerce & Humanities streams with NEET/JEE and career support", url: root + "academics/senior-secondary.html", badge: "Academics", class: "badge-academics" },
    { title: "Campus Facilities & Labs", desc: "Brain Science Lab, Data Science Studio, sports arena, library and GPS buses", url: root + "facilities.html", badge: "Facilities", class: "badge-facilities" },
    { title: "Transport Fleet & Rewa Bus Routes", desc: "GPS tracking, CCTV safety, lady attendants and coverage across Rewa", url: root + "facilities.html#transport", badge: "Transport", class: "badge-facilities" },
    { title: "All Events & Annual Calendar", desc: "Celebration directory, cultural festivals and annual activity calendar", url: root + "events.html", badge: "Events", class: "badge-events" },
    { title: "Annual Function", desc: "Grand cultural performances, stage acts, awards and exhibitions", url: root + "events/annual-function.html", badge: "Celebrations", class: "badge-events" },
    { title: "Garba Celebration", desc: "Traditional Navratri folk dance, colorful attire and cultural rhythm", url: root + "events/garba.html", badge: "Celebrations", class: "badge-events" },
    { title: "Ganesh Chaturthi", desc: "Eco-friendly idols, morning prayers and Vedic blessings", url: root + "events/ganesh-chaturthi.html", badge: "Celebrations", class: "badge-events" },
    { title: "Independence Day", desc: "Flag hoisting, patriotic parade, speeches and tribute to national heroes", url: root + "events/independence-day.html", badge: "Celebrations", class: "badge-events" },
    { title: "Diwali Celebration", desc: "Diya lighting, charity drives, rangoli making and safety awareness", url: root + "events/diwali.html", badge: "Celebrations", class: "badge-events" },
    { title: "Teachers' Day", desc: "Student-led council day, gratitude programs and awards for educators", url: root + "events/teachers-day.html", badge: "Celebrations", class: "badge-events" },
    { title: "Van Mahotsav", desc: "Tree plantation drive, eco-club activities and green campus initiatives", url: root + "events/van-mahotsav.html", badge: "Celebrations", class: "badge-events" },
    { title: "Christmas Celebration", desc: "Winter festivities, choir carols, gift sharing and nativity play", url: root + "events/christmas.html", badge: "Celebrations", class: "badge-events" },
    { title: "Raksha Bandhan", desc: "Sibling bonds, handmade ecofriendly rakhis and values of care", url: root + "events/raksha-bandhan.html", badge: "Celebrations", class: "badge-events" },
    { title: "International Yoga Day", desc: "Surya Namaskar, pranayama breathing, mindfulness and wellness", url: root + "events/yoga-day.html", badge: "Celebrations", class: "badge-events" },
    { title: "Book Week & Literary Fest", desc: "Author readings, book fair, creative writing and library exploration", url: root + "events/book-week.html", badge: "Celebrations", class: "badge-events" },
    { title: "Sports Day", desc: "Athletics track, relay, football, chess championships and trophies", url: root + "events/sports-day.html", badge: "Celebrations", class: "badge-events" },
    { title: "Contact Us & Campus Directions", desc: "16/1034 Azad Nagar, Ward 16, Urrahat Rewa | Phone: +91 9329517009", url: root + "contact.html", badge: "Contact", class: "badge-general" },
    { title: "Frequently Asked Questions (FAQs)", desc: "Admissions, curriculum, timings, uniforms, transport and fee questions", url: root + "faqs.html", badge: "Help", class: "badge-general" },
    { title: "Privacy Policy", desc: "Student data confidentiality, portal privacy and security guidelines", url: root + "privacy.html", badge: "Policy", class: "badge-general" },
    { title: "Terms of Use", desc: "Code of conduct, campus rules and portal terms of service", url: root + "terms.html", badge: "Policy", class: "badge-general" },
    { title: "Fee Refund & Cancellation Policy", desc: "Guidelines on security deposit refund, TC processing and adjustments", url: root + "refund-policy.html", badge: "Policy", class: "badge-admissions" }
  ];

  // Inject Search Modal into DOM if missing
  function initSearchModal() {
    if (document.getElementById("searchModal")) return;

    const modalHTML = `
      <div class="search-modal-backdrop" id="searchModal" aria-hidden="true">
        <div class="search-modal-box" role="dialog" aria-modal="true" aria-label="Site Search">
          <div class="search-input-wrap">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="siteSearchInput" placeholder="Type to search (e.g. fees, admission, bus, principal, events)..." autocomplete="off">
            <button type="button" class="search-close-btn" id="searchCloseBtn" aria-label="Close search">ESC</button>
          </div>
          
          <div class="search-chips-bar">
            <span class="search-chip-label">Quick:</span>
            <button type="button" class="search-chip" data-query="fee">Fee Structure</button>
            <button type="button" class="search-chip" data-query="admission">Admission</button>
            <button type="button" class="search-chip" data-query="transport">Transport</button>
            <button type="button" class="search-chip" data-query="download">Circulars</button>
            <button type="button" class="search-chip" data-query="gallery">Gallery</button>
            <button type="button" class="search-chip" data-query="contact">Contact</button>
          </div>

          <div class="search-results-list" id="searchResultsList" role="listbox">
            <!-- Results injected here -->
          </div>

          <div class="search-footer-hint">
            <span>Navigate: <kbd>↑</kbd> <kbd>↓</kbd></span>
            <span>Select: <kbd>Enter</kbd></span>
            <span>Close: <kbd>Esc</kbd></span>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    const backdrop = document.getElementById("searchModal");
    const input = document.getElementById("siteSearchInput");
    const closeBtn = document.getElementById("searchCloseBtn");
    const resultsContainer = document.getElementById("searchResultsList");
    let selectedIndex = 0;

    function renderResults(query = "") {
      const q = query.trim().toLowerCase();
      let filtered = [];

      if (!q) {
        filtered = siteSearchIndex.slice(0, 8); // Top featured items by default
      } else {
        filtered = siteSearchIndex.filter(item => 
          item.title.toLowerCase().includes(q) || 
          item.desc.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
        );
      }

      if (filtered.length === 0) {
        resultsContainer.innerHTML = `
          <div class="search-empty-state">
            <p>No results found for "<strong>${escapeHtml(query)}</strong>"</p>
            <small style="display:block; margin-top:6px; color:#94a3b8;">Try searching for "fees", "admissions", "syllabus", "principal", or "bus routes".</small>
          </div>
        `;
        return;
      }

      selectedIndex = 0;
      resultsContainer.innerHTML = filtered.map((item, idx) => `
        <a href="${item.url}" class="search-item ${item.class} ${idx === 0 ? 'selected' : ''}" data-index="${idx}" role="option">
          <div class="search-item-left">
            <span class="search-item-badge">${item.badge}</span>
            <div class="search-item-info">
              <span class="search-item-title">${highlightMatch(item.title, q)}</span>
              <span class="search-item-desc">${highlightMatch(item.desc, q)}</span>
            </div>
          </div>
          <span class="search-item-arrow">→</span>
        </a>
      `).join("");
    }

    function highlightMatch(text, q) {
      if (!q) return text;
      const escaped = q.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      const regex = new RegExp('(' + escaped + ')', 'gi');
      return text.replace(regex, "<mark style='background:#fef08a; color:#1e293b; padding:0 2px; border-radius:2px;'>$1</mark>");
    }

    function escapeHtml(str) {
      return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
    }

    function openSearch(initialQuery = "") {
      backdrop.classList.add("open");
      backdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (initialQuery) {
        input.value = initialQuery;
      }
      renderResults(input.value);
      setTimeout(() => input.focus(), 50);
    }

    function closeSearch() {
      backdrop.classList.remove("open");
      backdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      input.value = "";
    }

    // Event listeners
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeSearch();
    });

    closeBtn.addEventListener("click", closeSearch);

    input.addEventListener("input", () => {
      renderResults(input.value);
    });

    // Chip triggers
    document.querySelectorAll(".search-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        input.value = chip.dataset.query;
        renderResults(input.value);
        input.focus();
      });
    });

    // Keyboard navigation
    input.addEventListener("keydown", (e) => {
      const items = resultsContainer.querySelectorAll(".search-item");
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        items[selectedIndex].classList.remove("selected");
        selectedIndex = (selectedIndex + 1) % items.length;
        items[selectedIndex].classList.add("selected");
        items[selectedIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        items[selectedIndex].classList.remove("selected");
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items[selectedIndex].classList.add("selected");
        items[selectedIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (items[selectedIndex]) {
          window.location.href = items[selectedIndex].getAttribute("href");
        }
      }
    });

    // Global keyboard shortcut: Ctrl+K or Cmd+K
    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (backdrop.classList.contains("open")) {
          closeSearch();
        } else {
          openSearch();
        }
      } else if (e.key === "Escape" && backdrop.classList.contains("open")) {
        closeSearch();
      }
    });

    // Attach to any search button in page
    document.querySelectorAll(".search-trigger-btn, #searchBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        openSearch();
      });
    });
  }

  initSearchModal();


  /* =========================================================
     INTERACTIVE GALLERY LIGHTBOX & FILTER
  ========================================================= */

  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-page-item");

  if (filterBtns.length && galleryItems.length) {
    // Inject Lightbox Modal if not present
    if (!document.getElementById("galleryLightbox")) {
      const lbHTML = `
        <div class="lightbox-modal" id="galleryLightbox" aria-hidden="true" role="dialog" aria-label="Photo Lightbox">
          <button type="button" class="lightbox-close" id="lightboxClose" aria-label="Close Lightbox">&times;</button>
          <button type="button" class="lightbox-btn lightbox-prev" id="lightboxPrev" aria-label="Previous photo">&#8249;</button>
          <button type="button" class="lightbox-btn lightbox-next" id="lightboxNext" aria-label="Next photo">&#8250;</button>
          
          <div class="lightbox-content">
            <div class="lightbox-img-wrap">
              <img src="" alt="" id="lightboxImg">
            </div>
            <div class="lightbox-caption">
              <div class="lightbox-caption-text">
                <h4 id="lightboxTitle"></h4>
                <small id="lightboxCategory"></small>
              </div>
              <div class="lightbox-counter" id="lightboxCounter">1 / 1</div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", lbHTML);
    }

    const lbModal = document.getElementById("galleryLightbox");
    const lbImg = document.getElementById("lightboxImg");
    const lbTitle = document.getElementById("lightboxTitle");
    const lbCategory = document.getElementById("lightboxCategory");
    const lbCounter = document.getElementById("lightboxCounter");
    const lbClose = document.getElementById("lightboxClose");
    const lbPrev = document.getElementById("lightboxPrev");
    const lbNext = document.getElementById("lightboxNext");

    let currentVisibleItems = Array.from(galleryItems);
    let currentIndex = 0;

    // Filter functionality
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        currentVisibleItems = [];

        galleryItems.forEach(item => {
          const category = item.dataset.category;
          if (filter === "all" || category === filter) {
            item.classList.remove("hidden");
            currentVisibleItems.push(item);
          } else {
            item.classList.add("hidden");
          }
        });
      });
    });

    function showLightbox(index) {
      if (!currentVisibleItems.length) return;
      currentIndex = (index + currentVisibleItems.length) % currentVisibleItems.length;
      const targetItem = currentVisibleItems[currentIndex];
      const img = targetItem.querySelector("img");
      const title = targetItem.dataset.title || targetItem.querySelector("h3")?.textContent || "Gallery Photo";
      const cat = targetItem.dataset.category || "Moment";

      lbImg.src = img.src;
      lbImg.alt = img.alt || title;
      lbTitle.textContent = title;
      lbCategory.textContent = cat;
      lbCounter.textContent = `${currentIndex + 1} / ${currentVisibleItems.length}`;

      lbModal.classList.add("open");
      lbModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lbModal.classList.remove("open");
      lbModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lbImg.src = "";
    }

    // Attach click to gallery items
    galleryItems.forEach(item => {
      item.addEventListener("click", () => {
        const index = currentVisibleItems.indexOf(item);
        if (index !== -1) {
          showLightbox(index);
        }
      });
    });

    lbClose?.addEventListener("click", closeLightbox);
    lbPrev?.addEventListener("click", () => showLightbox(currentIndex - 1));
    lbNext?.addEventListener("click", () => showLightbox(currentIndex + 1));

    lbModal?.addEventListener("click", (e) => {
      if (e.target === lbModal) closeLightbox();
    });

    // Keyboard support
    window.addEventListener("keydown", (e) => {
      if (!lbModal?.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showLightbox(currentIndex - 1);
      if (e.key === "ArrowRight") showLightbox(currentIndex + 1);
    });
  }

});

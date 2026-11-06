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
    const dropdownButton = dropdown.querySelector(".nav-dropdown-toggle, .nav-portal-btn");

    if (!dropdownButton) return;

    dropdownButton.addEventListener("click", (event) => {
      if (window.innerWidth <= 1000 || dropdown.classList.contains("nav-portal-dropdown")) {
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
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("active");
      }
    });

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
    { title: "School Transport Support & Safety", desc: "Approved routes, supervision, guidelines, parent FAQs and helpline +91 9425621360", url: root + "transport.html", badge: "Transport", class: "badge-facilities" },
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

  /* =========================================================
     CAMPUS FACILITIES FILTER (31 FACILITIES)
  ========================================================= */

  const facilityPills = document.querySelectorAll(".facility-filter-pill");
  const facilityCards = document.querySelectorAll(".facility-card[data-category]");

  if (facilityPills.length && facilityCards.length) {
    facilityPills.forEach(pill => {
      pill.addEventListener("click", () => {
        facilityPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");

        const targetCat = pill.dataset.filter;

        facilityCards.forEach(card => {
          const cardCats = (card.dataset.category || "").split(" ");
          if (targetCat === "all" || cardCats.includes(targetCat)) {
            card.classList.remove("is-hidden");
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });
  }


  /* =========================================================
     TOPPERS & ACHIEVERS AUTO-SLIDER & YEAR MANAGER
  ========================================================= */
  const topperTrack = document.getElementById("topperTrack");
  const topperPrev = document.getElementById("topperPrev");
  const topperNext = document.getElementById("topperNext");
  const topperWrapper = document.getElementById("topperWrapper");
  const topperYearTabs = document.getElementById("topperYearTabs");
  const topperYearSelect = document.getElementById("topperYearSelect");

  if (topperTrack && topperWrapper) {
    const TOPPERS_STORAGE_KEY = "savvy_toppers_data";

    const DEFAULT_TOPPERS_DATA = {
      years: ["2025-26", "2024-25", "2023-24"],
      activeYear: "2025-26",
      students: [
        {
          id: "s1",
          name: "Aarav Sharma",
          class: "Class 10",
          year: "2025-26",
          rank: "Rank 1",
          score: "98.8%",
          photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s2",
          name: "Ananya Patel",
          class: "Class 12 (Science)",
          year: "2025-26",
          rank: "Rank 1",
          score: "98.2%",
          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s3",
          name: "Rohan Verma",
          class: "Class 9",
          year: "2025-26",
          rank: "Rank 2",
          score: "97.6%",
          photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s4",
          name: "Priya Singh",
          class: "Class 12 (Commerce)",
          year: "2025-26",
          rank: "Rank 2",
          score: "97.2%",
          photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s5",
          name: "Ishaan Tiwari",
          class: "Class 8",
          year: "2025-26",
          rank: "Rank 3",
          score: "96.8%",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s6",
          name: "Sneha Mishra",
          class: "Class 11 (Arts)",
          year: "2025-26",
          rank: "Rank 3",
          score: "96.4%",
          photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s7",
          name: "Divyansh Pandey",
          class: "Class 7",
          year: "2025-26",
          rank: "Class Topper",
          score: "95.8%",
          photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s8",
          name: "Kavya Soni",
          class: "Class 6",
          year: "2025-26",
          rank: "Class Topper",
          score: "95.2%",
          photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s9",
          name: "Aditi Dwivedi",
          class: "Class 12",
          year: "2024-25",
          rank: "Rank 1",
          score: "98.5%",
          photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s10",
          name: "Siddharth Shukla",
          class: "Class 10",
          year: "2024-25",
          rank: "Rank 1",
          score: "98.0%",
          photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=400&q=80"
        },
        {
          id: "s11",
          name: "Ayush Mishra",
          class: "Class 12",
          year: "2023-24",
          rank: "Rank 1",
          score: "97.8%",
          photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
        }
      ]
    };

    function getToppersData() {
      try {
        const raw = localStorage.getItem(TOPPERS_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && Array.isArray(parsed.students)) {
            return parsed;
          }
        }
      } catch (e) {
        console.error("Toppers data parse error", e);
      }
      return DEFAULT_TOPPERS_DATA;
    }

    let toppersData = getToppersData();
    let selectedYear = toppersData.activeYear || "2025-26";
    let manualOffset = 0;

    function renderTopperCards(year) {
      const filtered = toppersData.students.filter(s => s.year === year);
      const list = filtered.length > 0 ? filtered : toppersData.students;

      const createCardHtml = (s) => {
        let rankClass = "rank-gold";
        let rankColor = "#f59e0b";
        let medalIcon = "fa-medal";
        let rankText = s.rank || "Class Topper";

        if (s.rank && s.rank.includes("2")) {
          rankClass = "rank-silver";
          rankColor = "#94a3b8";
        } else if (s.rank && s.rank.includes("3")) {
          rankClass = "rank-bronze";
          rankColor = "#b45309";
        } else if (s.rank && !s.rank.includes("1")) {
          rankClass = "rank-star";
          rankColor = "#3b82f6";
          medalIcon = "fa-award";
        }

        const photoUrl = s.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0e3a80&color=fff&size=200`;

        return `
          <div class="student-card">
            <span class="student-rank-badge ${rankClass}"><i class="fa-solid fa-trophy"></i> ${rankText}</span>
            <div class="student-photo-wrap">
              <img src="${photoUrl}" alt="${s.name}" class="student-photo" loading="lazy" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=0e3a80&color=fff&size=200'">
              <span class="student-medal-badge"><i class="fa-solid ${medalIcon}" style="color: ${rankColor};"></i></span>
            </div>
            <h4 class="student-name">${s.name}</h4>
            <p class="student-class"><i class="fa-solid fa-graduation-cap"></i> ${s.class}</p>
            <div class="student-score-box">
              <div class="score-main">
                <span class="score-val">${s.score ? s.score.replace('%', '') : 'Top'}</span>
                ${s.score && s.score.includes('%') ? '<span class="score-unit">%</span>' : ''}
              </div>
              <span class="score-kicker">${s.score ? 'Score' : 'Achiever'}</span>
            </div>
          </div>
        `;
      };

      // Generate items, duplicating if needed for continuous marquee
      let html = "";
      const repeatCount = list.length < 5 ? 4 : 2;
      for (let r = 0; r < repeatCount; r++) {
        html += list.map(createCardHtml).join("");
      }

      topperTrack.innerHTML = html;
      topperTrack.style.transform = "none";
      topperTrack.style.animation = "";
      manualOffset = 0;
    }

    function renderYearFilter() {
      if (topperYearSelect) {
        topperYearSelect.innerHTML = "";
        toppersData.years.forEach(year => {
          const opt = document.createElement("option");
          opt.value = year;
          opt.textContent = `Session ${year}`;
          if (year === selectedYear) opt.selected = true;
          topperYearSelect.appendChild(opt);
        });
      } else if (topperYearTabs) {
        topperYearTabs.innerHTML = '<span class="topper-year-label"><i class="fa-solid fa-calendar-check"></i> Session:</span>';
        toppersData.years.forEach(year => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = `topper-year-pill ${year === selectedYear ? "active" : ""}`;
          btn.textContent = year;
          btn.onclick = () => {
            selectedYear = year;
            renderYearFilter();
            renderTopperCards(selectedYear);
          };
          topperYearTabs.appendChild(btn);
        });
      }
    }

    if (topperYearSelect) {
      topperYearSelect.addEventListener("change", (e) => {
        selectedYear = e.target.value;
        renderTopperCards(selectedYear);
      });
    }

    // Initial render
    renderYearFilter();
    renderTopperCards(selectedYear);

    // Sync in real-time if edited in toppers-manager.html in another tab
    window.addEventListener("storage", (e) => {
      if (e.key === TOPPERS_STORAGE_KEY) {
        toppersData = getToppersData();
        renderYearFilter();
        renderTopperCards(selectedYear);
      }
    });

    // Pause on hover
    topperWrapper.addEventListener("mouseenter", () => {
      topperTrack.style.animationPlayState = "paused";
    });
    topperWrapper.addEventListener("mouseleave", () => {
      topperTrack.style.animationPlayState = "running";
    });

    // Touch support for pause
    topperWrapper.addEventListener("touchstart", () => {
      topperTrack.style.animationPlayState = "paused";
    }, { passive: true });
    topperWrapper.addEventListener("touchend", () => {
      topperTrack.style.animationPlayState = "running";
    }, { passive: true });

    // Step navigation buttons (steps exactly 1 card dynamically)
    if (topperPrev && topperNext) {
      const getStep = () => {
        const card = topperTrack.querySelector(".student-card");
        return card ? (card.offsetWidth + (window.innerWidth <= 768 ? 20 : 28)) : 388;
      };

      topperPrev.addEventListener("click", () => {
        topperTrack.style.animation = "none";
        manualOffset += getStep();
        if (manualOffset > 0) {
          manualOffset = -(topperTrack.scrollWidth / 2);
        }
        topperTrack.style.transform = `translate3d(${manualOffset}px, 0, 0)`;
        topperTrack.style.transition = "transform 0.4s ease";
      });

      topperNext.addEventListener("click", () => {
        topperTrack.style.animation = "none";
        manualOffset -= getStep();
        if (Math.abs(manualOffset) >= (topperTrack.scrollWidth / 2)) {
          manualOffset = 0;
        }
        topperTrack.style.transform = `translate3d(${manualOffset}px, 0, 0)`;
        topperTrack.style.transition = "transform 0.4s ease";
      });
    }
  }

  
  /* =========================================================
     TOPPERS PASSWORD AUTH MODAL & NAVBAR ICON BUTTON
     Password: savvy (case-insensitive)
  ========================================================= */
  const openToppersBtn = document.getElementById("openToppersBtn");
  const toppersModal = document.getElementById("toppersPasswordModal");
  const closeToppersModal = document.getElementById("closeToppersModal");
  const toppersAuthForm = document.getElementById("toppersAuthForm");
  const topperAuthPass = document.getElementById("topperAuthPass");
  const topperAuthError = document.getElementById("topperAuthError");
  const toggleTopperEye = document.getElementById("toggleTopperEye");

  function openToppersManager() {
    if (sessionStorage.getItem("savvy_toppers_auth") === "true") {
      window.location.href = "toppers-manager.html";
      return;
    }
    if (toppersModal) {
      toppersModal.classList.add("show");
      if (topperAuthError) topperAuthError.style.display = "none";
      if (topperAuthPass) {
        topperAuthPass.value = "";
        setTimeout(() => topperAuthPass.focus(), 150);
      }
    } else {
      window.location.href = "toppers-manager.html";
    }
  }

  if (openToppersBtn) {
    openToppersBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openToppersManager();
    });
  }

  document.querySelectorAll(".open-toppers-auth").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openToppersManager();
    });
  });

  if (closeToppersModal && toppersModal) {
    closeToppersModal.addEventListener("click", () => {
      toppersModal.classList.remove("show");
    });
    toppersModal.addEventListener("click", (e) => {
      if (e.target === toppersModal) toppersModal.classList.remove("show");
    });
  }

  if (toggleTopperEye && topperAuthPass) {
    toggleTopperEye.addEventListener("click", () => {
      const isPassword = topperAuthPass.type === "password";
      topperAuthPass.type = isPassword ? "text" : "password";
      toggleTopperEye.innerHTML = isPassword ? '<i class="fa-solid fa-eye-slash"></i>' : '<i class="fa-solid fa-eye"></i>';
    });
  }

  if (toppersAuthForm && topperAuthPass) {
    toppersAuthForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const entered = topperAuthPass.value.trim().toLowerCase();
      if (entered === "savvy") {
        sessionStorage.setItem("savvy_toppers_auth", "true");
        window.location.href = "toppers-manager.html";
      } else {
        if (topperAuthError) {
          topperAuthError.style.display = "block";
          topperAuthPass.select();
        }
      }
    });
  }

  /* =========================================================
     RADIAL EMBLEM SPOKES & CALLOUTS (LIKE USER SKETCH)
  ========================================================= */
  const radialStage = document.querySelector(".radial-emblem-stage");
  if (radialStage) {
    const logoImg = radialStage.querySelector(".radial-logo-img");
    const svgLines = radialStage.querySelector(".radial-pointer-lines");

    // 12 petal angles matching clockwise order:
    // 01: Courage (11:30) ~-105 deg
    // 02: Progress (1:00) ~-75 deg
    // 03: Receptivity (2:00) ~-45 deg
    // 04: Aspiration (3:00) ~-15 deg
    // 05: Perseverance (4:00) ~15 deg
    // 06: Gratitude (5:00) ~45 deg
    // 07: Humility (6:00 right) ~75 deg
    // 08: Sincerity (6:00 left) ~105 deg
    // 09: Peace (7:30) ~135 deg
    // 10: Equality (8:30) ~165 deg
    // 11: Generosity (9:30) ~195 deg
    // 12: Goodness (10:30) ~225 deg
    const angles = [-105, -75, -45, -15, 15, 45, 75, 105, 135, 165, 195, 225];

    function renderSpokes() {
      if (!radialStage || !logoImg || !svgLines) return;
      if (window.innerWidth < 992) {
        svgLines.innerHTML = "";
        return;
      }

      const stageRect = radialStage.getBoundingClientRect();
      const logoRect = logoImg.getBoundingClientRect();

      const cx = (logoRect.left + logoRect.width / 2) - stageRect.left;
      const cy = (logoRect.top + logoRect.height / 2) - stageRect.top;
      const r = (logoRect.width / 2) * 0.78;

      const boxes = radialStage.querySelectorAll(".radial-callout-box");
      let markup = "";

      boxes.forEach((box, i) => {
        const boxRect = box.getBoundingClientRect();
        const deg = angles[i] !== undefined ? angles[i] : (i * 30 - 90);
        const rad = deg * (Math.PI / 180);

        const x1 = cx + r * Math.cos(rad);
        const y1 = cy + r * Math.sin(rad);

        const bLeft = boxRect.left - stageRect.left;
        const bTop = boxRect.top - stageRect.top;
        const bRight = bLeft + boxRect.width;
        const bBottom = bTop + boxRect.height;
        const bCx = bLeft + boxRect.width / 2;
        const bCy = bTop + boxRect.height / 2;

        let x2 = bCx;
        let y2 = bCy;

        if (bRight < cx) {
          x2 = bRight;
          y2 = bCy;
        } else if (bLeft > cx) {
          x2 = bLeft;
          y2 = bCy;
        } else if (bBottom < cy) {
          x2 = bCx;
          y2 = bBottom;
        } else {
          x2 = bCx;
          y2 = bTop;
        }

        const color = box.getAttribute("data-color") || "#711020";
        markup += `<g class="spoke-link spoke-${i + 1}">
          <line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="2" stroke-linecap="round" opacity="0.85" />
          <circle cx="${x1.toFixed(1)}" cy="${y1.toFixed(1)}" r="4.5" fill="${color}" stroke="#ffffff" stroke-width="1.5" />
          <circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="3.5" fill="${color}" />
        </g>`;
      });

      svgLines.innerHTML = markup;
    }

    renderSpokes();
    window.addEventListener("resize", renderSpokes);
    window.addEventListener("load", renderSpokes);
    setTimeout(renderSpokes, 100);
    setTimeout(renderSpokes, 400);

    const boxes = radialStage.querySelectorAll(".radial-callout-box");
    boxes.forEach((box, idx) => {
      box.addEventListener("mouseenter", () => {
        const spoke = svgLines.querySelector(`.spoke-${idx + 1} line`);
        if (spoke) {
          spoke.setAttribute("stroke-width", "3.5");
          spoke.setAttribute("opacity", "1");
        }
      });
      box.addEventListener("mouseleave", () => {
        const spoke = svgLines.querySelector(`.spoke-${idx + 1} line`);
        if (spoke) {
          spoke.setAttribute("stroke-width", "2");
          spoke.setAttribute("opacity", "0.85");
        }
      });
    });
  }


  /* =========================================================
     SCHOOL MANAGEMENT ERP INTEGRATION
     - Connects online admission, inquiry, and contact forms
     - Injects portal login actions into navigation
  ========================================================= */
  try {
    const config = window.SAVVY_ERP_CONFIG || {};
    const API_BASE_URL =
      config.apiBaseUrl ||
      window.SAVVY_FORM_ENDPOINT ||
      "https://savvy-school-management-backend.onrender.com/api";
    const LOGIN_URL =
      config.loginUrl ||
      window.SCHOOL_MANAGEMENT_LOGIN_URL ||
      "https://savvy-school-management.vercel.app/login";

    // 1. Inject Styles for Navigation Login Links
    if (!document.getElementById("savvy-erp-nav-styles")) {
      const style = document.createElement("style");
      style.id = "savvy-erp-nav-styles";
      style.textContent = `
        .erp-nav-divider {
          height: 1px;
          margin: 8px 6px;
          background: rgba(167, 25, 48, 0.15);
        }
        .erp-portal-actions {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 4px 0 2px 0;
        }
        .erp-portal-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 8px;
          font-family: 'Manrope', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          color: #ffffff !important;
          background: linear-gradient(135deg, #a71930, #711020);
          box-shadow: 0 4px 14px rgba(167, 25, 48, 0.25);
          transition: all 0.22s ease;
        }
        .erp-portal-link:hover {
          background: linear-gradient(135deg, #c62b45, #8a1327);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(167, 25, 48, 0.35);
        }
        .erp-portal-link.secondary {
          background: #fffdf8;
          color: #711020 !important;
          border: 1.5px solid #a71930;
          box-shadow: none;
        }
        .erp-portal-link.secondary:hover {
          background: #fff1bd;
          color: #711020 !important;
        }
        .erp-submitting {
          opacity: 0.65;
          pointer-events: none;
          cursor: wait !important;
        }
      `;
      document.head.appendChild(style);
    }

    // 2. Inject Portal Login links into Navigation
    const portalMenus = document.querySelectorAll(
      ".portal-dropdown-menu, .nav-portal-dropdown .nav-dropdown-menu, .nav-parent-dropdown"
    );
    portalMenus.forEach((menu) => {
      if (menu.querySelector(".erp-portal-actions")) return;

      const divider = document.createElement("div");
      divider.className = "erp-nav-divider";
      menu.appendChild(divider);

      const actionWrap = document.createElement("div");
      actionWrap.className = "erp-portal-actions";

      const staffLink = document.createElement("a");
      staffLink.className = "erp-portal-link";
      staffLink.href = LOGIN_URL;
      staffLink.target = "_blank";
      staffLink.rel = "noopener noreferrer";
      staffLink.innerHTML = `<i class="fa-solid fa-lock"></i> Admin / Staff Login`;

      const studentLink = document.createElement("a");
      studentLink.className = "erp-portal-link secondary";
      studentLink.href = LOGIN_URL;
      studentLink.target = "_blank";
      studentLink.rel = "noopener noreferrer";
      studentLink.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> Student & Parent Portal`;

      actionWrap.appendChild(staffLink);
      actionWrap.appendChild(studentLink);
      menu.appendChild(actionWrap);
    });

    // 3. Helper to Post Lead to API
    async function submitLead(leadData) {
      const endpoint = `${API_BASE_URL.replace(/\/+$/, "")}/website-leads`;
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(leadData),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
      } catch (err) {
        console.warn("ERP lead notice:", err.message);
        return { success: false, offline: true };
      }
    }

    // 4. Hook Online Admission Form
    const admForm = document.getElementById("onlineAdmissionForm");
    if (admForm && !admForm.dataset.erpBound) {
      admForm.dataset.erpBound = "true";
      admForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const btn = admForm.querySelector('button[type="submit"]');
        const origText = btn ? btn.innerHTML : "";
        if (btn) {
          btn.classList.add("erp-submitting");
          btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Application...`;
        }

        const inputs = admForm.querySelectorAll("input, select, textarea");
        const payload = {};
        inputs.forEach((input) => {
          const key =
            input.name ||
            input.id ||
            input.getAttribute("placeholder") ||
            input.previousElementSibling?.textContent?.trim() ||
            "field_" + Math.random().toString(36).slice(2, 6);
          if (input.value) payload[key] = input.value.trim();
        });

        const childName =
          admForm.querySelector('input[placeholder*="Aarav Sharma"]')?.value?.trim() ||
          payload["Student's Full Name *"] || "";
        const fatherName =
          admForm.querySelector('input[placeholder*="Rajesh Sharma"]')?.value?.trim() ||
          payload["Father's Name *"] || "";
        const motherName =
          admForm.querySelector('input[placeholder*="Sunita Sharma"]')?.value?.trim() ||
          payload["Mother's Name *"] || "";
        const phone =
          admForm.querySelector('input[type="tel"]')?.value?.trim() ||
          payload["Primary Contact Mobile (WhatsApp) *"] || "";
        const email =
          admForm.querySelector('input[type="email"]')?.value?.trim() ||
          payload["Email Address *"] || "";
        const classSelect = admForm.querySelector("select");
        const className = classSelect ? classSelect.value : "";

        await submitLead({
          source: "savvy-mother-school-rewa",
          formType: "admission",
          childName,
          parentName: fatherName || motherName,
          className,
          phone,
          email,
          subject: `Online Admission Application: ${childName} (${className})`,
          payload: {
            ...payload,
            fatherName,
            motherName,
            submissionDate: new Date().toISOString(),
          },
        });

        const successMsg = document.getElementById("admSuccessMsg");
        if (successMsg) {
          successMsg.style.display = "block";
          window.scrollTo({
            top: successMsg.offsetTop - 120,
            behavior: "smooth",
          });
        }
        admForm.reset();
        if (btn) {
          btn.classList.remove("erp-submitting");
          btn.innerHTML = origText;
        }
      });
    }

    // 5. Hook Inquiry Form
    const inqForm = document.getElementById("inquiryForm");
    if (inqForm && !inqForm.dataset.erpBound) {
      inqForm.dataset.erpBound = "true";
      inqForm.removeAttribute("onsubmit");
      inqForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const btn = inqForm.querySelector('button[type="submit"]');
        const origText = btn ? btn.innerHTML : "";
        if (btn) {
          btn.classList.add("erp-submitting");
          btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Submitting Inquiry...`;
        }

        const childName = document.getElementById("childName")?.value?.trim() || "";
        const parentName = document.getElementById("parentName")?.value?.trim() || "";
        const phone = document.getElementById("phone")?.value?.trim() || "";
        const email = document.getElementById("email")?.value?.trim() || "";
        const grade = document.getElementById("grade")?.value || "";
        const message = document.getElementById("message")?.value?.trim() || "";

        await submitLead({
          source: "savvy-mother-school-rewa",
          formType: "enquiry",
          childName,
          parentName,
          className: grade,
          phone,
          email,
          message,
          subject: `Campus Inquiry: ${childName || parentName} (${grade || "General"})`,
          payload: { childName, parentName, phone, email, grade, message },
        });

        const successMsg =
          document.getElementById("successMessage") ||
          document.getElementById("inquirySuccess");
        if (successMsg) successMsg.style.display = "block";

        inqForm.reset();
        if (btn) {
          btn.classList.remove("erp-submitting");
          btn.innerHTML = origText;
        }
      });
    }

    // 6. Hook Contact Form
    const cntForm = document.getElementById("contactForm");
    if (cntForm && !cntForm.dataset.erpBound) {
      cntForm.dataset.erpBound = "true";
      cntForm.removeAttribute("onsubmit");
      cntForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const btn = cntForm.querySelector('button[type="submit"]');
        const origText = btn ? btn.innerHTML : "";
        if (btn) {
          btn.classList.add("erp-submitting");
          btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...`;
        }

        const name = document.getElementById("cName")?.value?.trim() || "";
        const email = document.getElementById("cEmail")?.value?.trim() || "";
        const phone = document.getElementById("cPhone")?.value?.trim() || "";
        const subject = document.getElementById("cSubject")?.value?.trim() || "";
        const message = document.getElementById("cMessage")?.value?.trim() || "";

        await submitLead({
          source: "savvy-mother-school-rewa",
          formType: "contact",
          parentName: name,
          phone,
          email,
          subject: subject || `Website Contact: ${name}`,
          message,
          payload: { name, email, phone, subject, message },
        });

        const successMsg = document.getElementById("contactSuccess");
        if (successMsg) successMsg.style.display = "block";

        cntForm.reset();
        if (btn) {
          btn.classList.remove("erp-submitting");
          btn.innerHTML = origText;
        }
      });
    }
  } catch (err) {
    console.warn("ERP integration initialization note:", err);
  }

});

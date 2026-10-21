document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     PRELOADER
  ========================================================= */

  const preloader = document.querySelector(".preloader");

  window.addEventListener("load", () => {
    if (preloader) {
      setTimeout(() => {
        preloader.classList.add("hide");
      }, 1500);
    }
  });

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

            element.textContent = value.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(animateCounter);
            } else {
              element.textContent = target.toLocaleString();
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
        threshold: 0.1
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
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
});
window.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");

  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const title = document.querySelector(".loader-title");
  const loaderText = title.dataset.text;
  [...loaderText].forEach((letter, index) => {
    const span = document.createElement("span");
    span.textContent = letter;
    span.style.opacity = "0";
    span.style.display = "inline-block";
    span.style.transitionDelay = `${index * 26}ms`;
    title.appendChild(span);
  });

  if (reducedMotion || !window.gsap) {
    document.querySelector(".preloader").style.display = "none";
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const loaderTimeline = gsap.timeline({
    defaults: { ease: "power3.out" },
    onComplete: () => {
      document.body.classList.add("loaded");
      gsap.set(".preloader", { display: "none" });
    }
  });

  loaderTimeline
    .to(".loader-mark", { scale: 1.12, duration: 0.35 })
    .to(".loader-circle", { scale: 24, duration: 0.7 }, "<")
    .to(".loader-title span", { opacity: 1, y: 0, stagger: 0.026, duration: 0.18 }, "-=0.35")
    .to(".preloader p", { opacity: 1, y: 0, duration: 0.35 }, "-=0.1")
    .to(".preloader", { yPercent: -100, duration: 0.82, ease: "power4.inOut", delay: 0.35 });

  gsap.set(".preloader p", { opacity: 0, y: 8 });
  gsap.set(".loader-title span", { y: 8 });

  gsap.from(".hero-copy > *", {
    x: -46,
    opacity: 0,
    stagger: 0.12,
    duration: 0.9,
    ease: "power3.out",
    delay: 1.75
  });

  gsap.from(".hero-media", {
    scale: 1.08,
    opacity: 0,
    duration: 1.1,
    ease: "power3.out",
    delay: 1.85
  });

  gsap.to(".orb", {
    y: -24,
    rotation: "+=10",
    duration: 4.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.6
  });

  gsap.to(".academic-icon", {
    y: -16,
    duration: 3.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    stagger: 0.4
  });

  document.querySelector(".hero").addEventListener("mousemove", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    gsap.to(".parallax-wrap", {
      rotateY: x * 5,
      rotateX: y * -5,
      x: x * 14,
      y: y * 10,
      duration: 0.5,
      ease: "power2.out"
    });

    document.querySelectorAll(".academic-icon").forEach((icon) => {
      const speed = Number(icon.dataset.speed || 1);
      gsap.to(icon, {
        x: x * 22 * speed,
        y: y * 20 * speed,
        duration: 0.5,
        ease: "power2.out"
      });
    });
  });

  document.querySelectorAll("[data-count]").forEach((counter) => {
    const target = Number(counter.dataset.count);
    ScrollTrigger.create({
      trigger: counter,
      start: "top 86%",
      once: true,
      onEnter: () => {
        gsap.fromTo(counter, { textContent: 0 }, {
          textContent: target,
          duration: 1.8,
          ease: "power2.out",
          snap: { textContent: 1 },
          onUpdate: () => {
            counter.textContent = Math.round(counter.textContent);
          }
        });
      }
    });
  });

  gsap.utils.toArray(".section-heading, .about-copy p, .tilt-card, .program-track article, .testimonial-track article").forEach((item) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 84%"
      },
      y: 42,
      opacity: 0,
      duration: 0.85,
      ease: "power3.out"
    });
  });

  gsap.from(".collage-large", {
    scrollTrigger: {
      trigger: ".collage",
      start: "top 78%"
    },
    x: -70,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from(".collage-small", {
    scrollTrigger: {
      trigger: ".collage",
      start: "top 74%"
    },
    x: 70,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.to(".campus img", {
    scale: 1.16,
    ease: "none",
    scrollTrigger: {
      trigger: ".campus",
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });

  gsap.to(".paper-plane", {
    x: 28,
    y: -22,
    rotation: -8,
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: y * -8,
        duration: 0.3,
        ease: "power2.out"
      });
    });
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.35, ease: "power2.out" });
    });
  });

  document.querySelectorAll(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      gsap.to(button, {
        x: (event.clientX - rect.left - rect.width / 2) * 0.18,
        y: (event.clientY - rect.top - rect.height / 2) * 0.18,
        duration: 0.25
      });
    });
    button.addEventListener("mouseleave", () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.3 });
    });
  });
});

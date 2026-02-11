document.addEventListener("DOMContentLoaded", () => {
  initYear();
  initContactBarToggle();
  initCarousel();
  initSmoothScroll();
  initScrollAnimations();
  initTickerPause();
});

function initYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function initContactBarToggle() {
  const toggle = document.getElementById("contactToggle");
  const bar = document.getElementById("contactBar");
  if (!toggle || !bar) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    bar.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    const clickedInside = toggle.contains(e.target) || bar.contains(e.target);
    if (!clickedInside) bar.classList.remove("active");
  });
}

function initCarousel() {
  const track = document.querySelector(".carousel-track");
  const cards = Array.from(document.querySelectorAll(".carousel-card"));
  const leftArrow = document.querySelector(".carousel-arrow-left");
  const rightArrow = document.querySelector(".carousel-arrow-right");
  const dots = Array.from(document.querySelectorAll(".dot"));

  if (!track || cards.length === 0 || !leftArrow || !rightArrow || dots.length === 0) return;

  let currentIndex = 0;

  function update(index) {
    const total = cards.length;
    currentIndex = (index + total) % total;

    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;

    cards.forEach((card, i) => {
      card.classList.remove("active", "prev", "next");
      if (i === currentIndex) card.classList.add("active");
      else if (i === prevIndex) card.classList.add("prev");
      else if (i === nextIndex) card.classList.add("next");
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  function next() { update(currentIndex + 1); }
  function prev() { update(currentIndex - 1); }

  leftArrow.addEventListener("click", prev);
  rightArrow.addEventListener("click", next);

  dots.forEach((dot, i) => dot.addEventListener("click", () => update(i)));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  });

  // Touch / swipe
  let startX = 0;
  let endX = 0;

  track.addEventListener("touchstart", (e) => {
    startX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].screenX;
    const diff = startX - endX;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
    }
  });

  update(0);
}

function initSmoothScroll() {
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 95;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function initScrollAnimations() {
  const elements = document.querySelectorAll(".trust-card, .testimonial-card, .target-card, .career-role");
  if (elements.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -80px 0px" });

  elements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.55s ease, transform 0.55s ease";
    observer.observe(el);
  });
}

function initTickerPause() {
  const ticker = document.querySelector(".ticker-track");
  if (!ticker) return;

  ticker.addEventListener("mouseenter", () => {
    ticker.style.animationPlayState = "paused";
  });
  ticker.addEventListener("mouseleave", () => {
    ticker.style.animationPlayState = "running";
  });
}

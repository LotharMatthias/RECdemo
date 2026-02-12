/**
 * Richter ElektroCom Website
 * Carousel and Interactive Elements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
});

/**
 * Initialize the carousel functionality
 */
function initCarousel() {
    const track = document.querySelector('.carousel-track');
    const cards = document.querySelectorAll('.carousel-card');
    const leftArrow = document.querySelector('.carousel-arrow-left');
    const rightArrow = document.querySelector('.carousel-arrow-right');
    const dots = document.querySelectorAll('.dot');

    if (!track || !cards.length || !leftArrow || !rightArrow || !dots.length) {
        console.warn('Carousel elements not found');
        return;
    }

    let currentIndex = 0;
    const totalCards = cards.length;

    /**
     * Update the carousel to show the card at the given index
     */
    function updateCarousel(index) {
        // Ensure index is within bounds
        if (index < 0) {
            index = totalCards - 1;
        } else if (index >= totalCards) {
            index = 0;
        }

        currentIndex = index;

        // Calculate prev and next indices
        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        const nextIndex = (currentIndex + 1) % totalCards;

        // Update cards with prev, active, and next classes
        cards.forEach((card, i) => {
            card.classList.remove('active', 'prev', 'next');

            if (i === currentIndex) {
                card.classList.add('active');
            } else if (i === prevIndex) {
                card.classList.add('prev');
            } else if (i === nextIndex) {
                card.classList.add('next');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    /**
     * Move to the next slide
     */
    function nextSlide() {
        updateCarousel(currentIndex + 1);
    }

    /**
     * Move to the previous slide
     */
    function prevSlide() {
        updateCarousel(currentIndex - 1);
    }

    // Event Listeners for arrows
    leftArrow.addEventListener('click', prevSlide);
    rightArrow.addEventListener('click', nextSlide);

    // Event Listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Auto-play functionality (optional - uncomment to enable)
    /*
    let autoPlayInterval;

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start auto-play
    startAutoPlay();

    // Pause auto-play on hover
    track.addEventListener('mouseenter', stopAutoPlay);
    track.addEventListener('mouseleave', startAutoPlay);

    // Pause auto-play when user interacts
    leftArrow.addEventListener('click', () => {
        stopAutoPlay();
        startAutoPlay();
    });

    rightArrow.addEventListener('click', () => {
        stopAutoPlay();
        startAutoPlay();
    });

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            stopAutoPlay();
            startAutoPlay();
        });
    });
    */

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }

    // Initialize carousel at first slide
    updateCarousel(0);
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');

        // Only handle internal anchors (not just "#")
        if (href && href !== '#') {
            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

/**
 * Add scroll-based animations (fade-in on scroll)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.trust-card, .footer-col');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
initScrollAnimations();

/**
 * Count-up animation for trust numbers
 */
function initCountUpAnimation() {
    const trustNumbers = document.querySelectorAll('.trust-number');
    const duration = 1000; // 1 second
    let hasAnimated = false;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;

                trustNumbers.forEach(numberElement => {
                    const targetText = numberElement.textContent.trim();
                    const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
                    const suffix = targetText.replace(/[0-9]/g, '').trim(); // Get suffix like "+" or ""

                    let startTime = null;

                    function animate(currentTime) {
                        if (!startTime) startTime = currentTime;
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function for smooth animation
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const currentNumber = Math.floor(easeOutQuart * targetNumber);

                        numberElement.textContent = currentNumber + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            numberElement.textContent = targetText; // Ensure final value is exact
                        }
                    }

                    requestAnimationFrame(animate);
                });

                observer.disconnect(); // Only animate once
            }
        });
    }, observerOptions);

    // Observe the trust section
    const trustSection = document.querySelector('.trust-section');
    if (trustSection) {
        observer.observe(trustSection);
    }
}

// Initialize count-up animation
initCountUpAnimation();

/**
 * Pause ticker animation on hover
 */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
    tickerTrack.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
    });

    tickerTrack.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
    });
}

/**
 * Toggle contact bar visibility
 */
const contactToggle = document.getElementById('contactToggle');
const contactBar = document.getElementById('contactBar');

if (contactToggle && contactBar) {
    contactToggle.addEventListener('click', function() {
        contactBar.classList.toggle('active');
    });

    // Close contact bar when clicking outside
    document.addEventListener('click', function(e) {
        if (!contactToggle.contains(e.target) && !contactBar.contains(e.target)) {
            contactBar.classList.remove('active');
        }
    });
}

/**
 * Mobile Burger Menu Toggle
 */
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navBoxes = document.querySelector('.nav-boxes');

if (mobileMenuToggle && navBoxes) {
    // Toggle mobile menu
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        this.classList.toggle('active');
        navBoxes.classList.toggle('mobile-menu-open');

        // Prevent body scroll when menu is open
        if (navBoxes.classList.contains('mobile-menu-open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navBoxes.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            navBoxes.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
        }
    });

    // Close menu when clicking on a nav item (but not dropdown toggles)
    navBoxes.addEventListener('click', function(e) {
        if (e.target.classList.contains('nav-box') ||
            e.target.classList.contains('dropdown-item')) {
            mobileMenuToggle.classList.remove('active');
            navBoxes.classList.remove('mobile-menu-open');
            document.body.style.overflow = '';
        }
    });

    // Mobile dropdown toggle
    const navBoxDropdowns = document.querySelectorAll('.nav-box-dropdown');

    navBoxDropdowns.forEach(dropdown => {
        const navBox = dropdown.querySelector('.nav-box');

        if (navBox) {
            navBox.addEventListener('click', function(e) {
                // On mobile, toggle dropdown instead of navigating
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Close other dropdowns
                    navBoxDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            otherDropdown.classList.remove('dropdown-open');
                        }
                    });

                    // Toggle current dropdown
                    dropdown.classList.toggle('dropdown-open');
                }
            });
        }
    });
}

/**
 * Testimonials Auto-Scroll Carousel
 * 2 visible at a time, auto-scroll every 5 seconds
 * 3 pages total (6 testimonials)
 */
function initTestimonialsAutoScroll() {
    const grid = document.querySelector('.testimonials-grid');
    const cards = document.querySelectorAll('.testimonial-card');
    const paginationContainer = document.querySelector('.testimonials-pagination');

    if (!grid || !cards.length) {
        return;
    }

    const totalCards = cards.length; // 6
    const cardsPerView = window.innerWidth <= 768 ? 1 : 2; // Mobile: 1, Desktop: 2
    const totalPages = Math.ceil(totalCards / cardsPerView); // 3 pages
    let currentPage = 0;
    let autoScrollInterval;
    let dots = [];

    // Generate pagination dots
    function generateDots() {
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';
        dots = [];

        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('div');
            dot.classList.add('pagination-dot');
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                currentPage = i;
                updateCarousel();
                updateDots();

                // Restart auto-scroll after manual interaction
                stopAutoScroll();
                startAutoScroll();
            });

            paginationContainer.appendChild(dot);
            dots.push(dot);
        }
    }

    // Update active dot
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth;
        const gap = window.innerWidth <= 768 ? 24 : 32;
        const scrollAmount = (cardWidth + gap) * cardsPerView * currentPage;

        grid.style.transform = `translateX(-${scrollAmount}px)`;
        updateDots();
    }

    function nextPage() {
        currentPage++;

        // Loop back to start after last page
        if (currentPage >= totalPages) {
            currentPage = 0;
        }

        updateCarousel();
    }

    function startAutoScroll() {
        autoScrollInterval = setInterval(nextPage, 5000); // 5 seconds
    }

    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }

    // Pause on hover
    grid.addEventListener('mouseenter', stopAutoScroll);
    grid.addEventListener('mouseleave', startAutoScroll);

    // Update on window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCarousel();
        }, 250);
    });

    // Initialize
    generateDots();
    updateCarousel();
    startAutoScroll();
}

// Initialize testimonials auto-scroll
initTestimonialsAutoScroll();

/**
 * Contact Form Handler
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('formSuccessMessage');

    if (!form || !successMessage) {
        return;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Here you would normally send the data to your server
        // For now, we'll just show the success message
        console.log('Form submitted:', data);

        // Simulate sending email (replace with actual backend call)
        // Example: fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })

        // Show success message
        successMessage.classList.add('show');

        // Reset form
        form.reset();

        // Hide success message after 10 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 10000);

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

// Initialize contact form
initContactForm();

/**
 * Smooth Scroll to Contact Form
 */
function initScrollToContact() {
    const scrollButtons = document.querySelectorAll('.scroll-to-contact');

    scrollButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll to contact
initScrollToContact();

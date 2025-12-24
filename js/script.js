// ============================================
// Dark Mode Toggle
// ============================================

(function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

document.addEventListener('DOMContentLoaded', function() {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');

  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ============================================
  // Smooth Scroll for Internal Links
  // ============================================

  const myWorkLink = document.getElementById('my-work-link');
  if (myWorkLink) {
    myWorkLink.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.getElementById('my-work-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // Project Filtering
  // ============================================

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCategories = document.querySelectorAll('.project-category');

  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Filter categories
      projectCategories.forEach(category => {
        const categoryType = category.getAttribute('data-category');

        if (filter === 'all') {
          category.classList.remove('hidden');
        } else if (categoryType === filter) {
          category.classList.remove('hidden');
        } else {
          category.classList.add('hidden');
        }
      });
    });
  });

  // ============================================
  // Intersection Observer for Scroll Animations
  // ============================================

  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ============================================
  // Form Submission Enhancement
  // ============================================

  const contactForm = document.querySelector('.contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const submitButton = this.querySelector('.submit-button');
      if (submitButton) {
        submitButton.innerHTML = '<span class="button-text">Sending...</span>';
        submitButton.disabled = true;
      }
    });
  }

  // ============================================
  // Keyboard Navigation Enhancement
  // ============================================

  // Add keyboard support for filter buttons
  filterButtons.forEach((button, index) => {
    button.addEventListener('keydown', function(e) {
      let targetIndex;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetIndex = (index + 1) % filterButtons.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetIndex = (index - 1 + filterButtons.length) % filterButtons.length;
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetIndex = filterButtons.length - 1;
      }

      if (targetIndex !== undefined) {
        filterButtons[targetIndex].focus();
      }
    });
  });

  // ============================================
  // Navbar Background on Scroll
  // ============================================

  const navbar = document.querySelector('.navbar');

  if (navbar) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

  // ============================================
  // Lazy Load Enhancement for External Images
  // ============================================

  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if (lazyImages.length > 0 && 'IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            imageObserver.unobserve(img);
          }
        });
      });

      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }
});

// ============================================
// System Theme Change Detection
// ============================================

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
  // Only update if user hasn't set a preference
  if (!localStorage.getItem('theme')) {
    document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
  }
});
